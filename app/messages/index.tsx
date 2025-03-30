import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, FlatList, Pressable, Dimensions, Image, Platform, Alert } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';
import { AUTHORITIES } from '../_util/Authorities';
import { withAuth } from '../_util/withAuth';
import CustomTextInput from '@/components/CustomTextInput';
import { useCallback, useEffect, useState } from 'react';
import CustomButton from '@/components/CustomButton';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { useNavigation, NavigationProp, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { BACKEND_API } from '@/constants/Mysc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotification } from '@/context/NotificationContext';


const { width } = Dimensions.get("window");

interface Message {
  id: number;
  title: string;
  body: string;
  code: string;
  //customImages: string[];
}

type RootStackParamList = {
  //'messages/listMyMessages': {messageId: number};
  'messages/listMyMessages': { messageId: number 
    is_newMessage: boolean;

  } | undefined;
  'messages/index': { 
    messageId: number;
    is_newMessage: boolean;

  } | undefined;
  

  

};

function MessageCreation() {

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, 'messages/listMyMessages'>>();

  const messageId = route.params?.messageId || undefined;
  const is_newMessage = route.params?.is_newMessage;

  const { showNotification } = useNotification();

  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    customImages: [] as string[],
  });

    useFocusEffect(
      useCallback(() => {

        if (is_newMessage) {
          setFormData({
            title: '',
            body: '',
            customImages: [],
          });
        }
      }, [is_newMessage])
    );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });


    if (!result.canceled) {

      const allowedFormats = ["jpg", "jpeg", "png"];
      const maxSizeMB = 5;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;

      const filteredAssets = result.assets.filter(asset => {
        const fileExtension = asset.mimeType ? asset.mimeType.split("/")[1] : "";
        const isFormatAllowed = allowedFormats.includes(fileExtension);
        const isSizeAllowed = asset.fileSize ? asset.fileSize <= maxSizeBytes : true;
        return isFormatAllowed && isSizeAllowed;
      });

      if (formData.customImages.length >= 5) {
        showNotification({
          message: "No puedes añadir mas de 5 imágenes",
          duration: 2500,
          type: "info",
        });
      }

      if (filteredAssets.length === 0) {
        showNotification({
          message: `Solo se permiten fotos en formato jpg, jpeg y png. El tamaño máximo es de ${maxSizeMB} MB.`,
          type: "info",
          duration: 2500,
        });
        return;
      }

      setFormData({
        ...formData,
        customImages: [...formData.customImages, ...filteredAssets.map(asset => asset.uri)]
      });
    }
  };

  useEffect(() => {
    const fetchMessageData = async () => {
      if (!is_newMessage) {
        
        try {
          const authToken = await AsyncStorage.getItem('authToken');
          const response = await fetch(`${BACKEND_API}/api/messages/${messageId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
          });

          if (response.ok) {
            console.log("response", response);
            const data = await response.json();
            setFormData({
              title: data.title,
              body: data.body,
              customImages: data.customImages || [],
            });
            setContacts(data.contacts || []);
          } else {
            console.error('Error al obtener los datos del mensaje');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      } else{
       
      }
    }
      fetchMessageData();
    }, [is_newMessage]);


  const handleSubmitMessage = async () => {

    const url = !is_newMessage ? `${BACKEND_API}/api/messages/${messageId}` : `${BACKEND_API}/api/messages`;
    const method = !is_newMessage ? 'PUT' : 'POST';

    const errors = validateMessageData(formData.title,formData.body);

    if (errors && errors.length > 0) {
      showNotification({
        message: `${errors.join("\n")}`,
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) throw new Error('No se encontró un token de autenticación');

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken.trim()}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigation.navigate("messages/listMyMessages" as never);
      } else {
        const errorText = await response.text();
        throw new Error(`Error en la creación del mensaje 1: ${errorText}`);
      }
    } catch (error: any) {
      console.error("Error en la creación del mensaje 2:", error.message);
      window.alert(`Error en la creación del mensaje 2: ${error.message}`);
    }
  };

  const validateMessageData = (title: string, body: string) => {
    const errors: string[] = [];


    if (!title || title.trim() === "") {
      errors.push("El título no puede estar vacío");
    }

    if (!body || body.trim() === "") {
      errors.push("El cuerpo del mensaje no puede estar vacío");
    }

    return errors;
  };




  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSaveMessage = () => {
    handleSubmitMessage();
  };

  const handleMediaPress = (uri: string) => {
    setSelectedMedia(uri);
  };


  // Modal to Select contacts y su lógica

  type Contact = {
    id: number;
    name: string;
    phone: string;
    email: string;
  };

 const [newContact, setNewContact] = useState<Contact>({
    id: Date.now(),
    name: "",
    phone: "",
    email: "",
  });

  const [contacts, setContacts] = useState<Contact[]>([]);
  
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  

  const [isContactModalVisible, setIsContactModalVisible] = useState(false);

  const handleChangeContact = (field: keyof Contact, value: string) => {
    setNewContact((prev) => ({ ...prev, [field]: value }));
  };



  const addContact = () => {

    if (!newContact.name || !newContact.phone || !newContact.email) {
      showNotification({
        message: `Todos los campos son obligatorios`,
        type: "info",
        duration: 2500,
      });
      return;
    }
    const errors = validateContactData(newContact);
    if (errors && errors.length > 0) {
      showNotification({
        message: `${errors.join("\n")}`,
        type: "info",
        duration: 2500,
      });
      return;
    }

    setNewContact({ id: Date.now(), name: "", phone: "", email: "" });
    setContacts([...contacts, newContact]);
    console.log("newContact", newContact);
  };

  const removeContact = (id: number) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };



  const validateContactData = (values: Contact) => {
    const errors: string[] = [];
    const emailRegex = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{3} \d{3} \d{3}$/;

    const phoneSet = new Set();
    const emailSet = new Set();

    if (!values.name || values.name.trim() === "") {
      errors.push("El nombre es obligatorio para el contacto");
    }

    if (!values.phone || !phoneRegex.test(values.phone)) {
      errors.push("Por favor, introduce un teléfono válido (sin prefijo)");
    }

    if (!values.email || !emailRegex.test(values.email)) {
      errors.push("El email no es válido.");
    }

    contacts.forEach((contact) => {
      phoneSet.add(contact.phone);
    });

    if (phoneSet.has(values.phone)) {
      errors.push("El teléfono ya ha sido añadido");
    }

    contacts.forEach((contact) => {
      emailSet.add(contact.email);
    }
    );

    if (emailSet.has(values.email)) {
      errors.push("El email ya ha sido añadido");
    }

    return errors;
  };

  // Logica para poner modal a true
  const handleSelectContacts = () => {
    //alert("Esta función estará disponible muy pronto!");
    setIsContactModalVisible(true);
  };

  const handleEditContact = (contact: { id: number; name: string; phone: string; email: string; }) => {
    removeContact(contact.id);
    setEditingContact(contact);
    setNewContact({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.textTitle}>Crea tu mensaje personalizado</Text>
  
        <CustomTextInput
          style={{ width: "100%" }}
          placeholder="Título del mensaje"
          maxLength={100}
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />
  
        <CustomTextInput
          style={styles.textArea}
          placeholder="Texto personalizado"
          maxLength={1999}
          multiline
          value={formData.body}
          onChangeText={(text) => setFormData({ ...formData, body: text })}
        />
  
        <View style={styles.buttonContainer}>
          <CustomButton
            color="blue"
            style={styles.customButton1}
            title="Seleccionar imágenes"
            onPress={pickImage}
          />
  
          <CustomButton
            color="blue"
            style={styles.customButton1}
            title="Seleccionar contactos"
            onPress={() => showNotification({
              message:"Esta función estará disponible muy pronto",
              type:"info",
              duration:2500,
            })}
          />
        </View>
  
        <CustomButton
          color="grey"
          style={styles.customButton2}
          title="Guardar mensaje"
          onPress={handleSaveMessage}
        />
      </View>
  
      <View style={styles.mediaContainer}>
        <View style={styles.mediaVisualizer}>
          {selectedMedia ? (
            <Image source={{ uri: selectedMedia }} style={styles.selectedMedia} />
          ) : (
            <Text style={styles.previewMessage}>
              No se ha seleccionado ningún archivo
            </Text>
          )}
        </View>
  
        <View style={styles.mediaItems}>
          <ScrollView horizontal>
            {formData.customImages.length > 0 &&
              formData.customImages.map((uri, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleMediaPress(uri)}
                >
                  <Image source={{ uri }} style={styles.customImage} />
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </View>
  
      {isContactModalVisible && (
        <View style={styles.modalContactContainer}>
          <Pressable
            style={styles.closeButton}
            onPress={() => setIsContactModalVisible(false)}
          >
            <AntDesign name="close" size={24} color="#434343" />
          </Pressable>
  
          <Text style={styles.contactTitle}>Agrega a tus contactos</Text>
  
          <View style={styles.contactContainer}>
            <CustomTextInput
              placeholder="Nombre"
              value={newContact.name}
              maxLength={50}
              onChangeText={(text) => handleChangeContact("name", text)}
              style={styles.input}
            />
            <CustomTextInput
              placeholder="Teléfono (sin prefijo)"
              value={newContact.phone}
              maxLength={11}
              keyboardType="phone-pad"
              onChangeText={(text) => {
                const numericText = text.replace(/\D/g, "");
                const formattedText = numericText.replace(/(\d{3})/g, "$1 ").trim();
                handleChangeContact("phone", formattedText);
              }}
              style={styles.input}
            />
            <CustomTextInput
              placeholder="Email"
              value={newContact.email}
              maxLength={50}
              keyboardType="email-address"
              onChangeText={(text) => handleChangeContact("email", text)}
              style={styles.input}
            />
            <CustomButton
              style={styles.addButton}
              title="Añadir"
              onPress={addContact}
            />
          </View>
  
          <Text style={styles.contactTitle}>Lista de contactos añadidos</Text>
          <ScrollView style={styles.tableContainer} horizontal>
            <View>
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Nombre</Text>
                <Text style={styles.headerCell}>Teléfono</Text>
                <Text style={styles.headerCell}>Email</Text>
                <Text style={styles.headerCell}>Acción</Text>
              </View>
  
              <ScrollView style={{ maxHeight: width > 600 ? width * 0.1 : width * 0.4 }}>
                <FlatList
                  data={contacts}
                  keyExtractor={(item) => item.id.toString()}
                  nestedScrollEnabled={true}
                  renderItem={({ item }) => (
                    <View style={styles.tableRow}>
                      <Text style={styles.cell}>{item.name}</Text>
                      <Text style={styles.cell}>{item.phone}</Text>
                      <Text style={styles.cell}>{item.email}</Text>
                      <View style={styles.actionCell}>
                        <CustomButton
                          title="Editar"
                          style={styles.editButton}
                          onPress={() => handleEditContact(item)}
                        />
                        <CustomButton
                          title="Eliminar"
                          style={styles.editButton}
                          color="red"
                          onPress={() => removeContact(item.id)}
                        />
                      </View>
                    </View>
                  )}
                />
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}  

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flexGrow: 1,
    flexDirection: width > 600 ? 'row' : 'column',
    justifyContent: 'space-between',
    padding: "1%",
  },
  formContainer: {
    width: width > 600 ? '45%' : "100%",
    justifyContent: 'flex-start',
    padding: 20,
  },
  mediaContainer: {
    width: width > 600 ? '55%' : "100%",
    padding: 20,
  },
  mediaVisualizer: {
    borderWidth: 5,
    borderColor: GlobalStyles.lightGrey,
    height: width > 600 ? "65%" : 400,
    borderRadius: 10,
    marginTop: 30,
  },
  mediaItems: {
    height: width > 600 ? "25%" : 100,
    borderColor: GlobalStyles.lightGrey,
    borderWidth: 5,
    borderRadius: 10,
    marginTop: 20,
    flexDirection: 'row',
  },
  customImage: {
    width: width > 600 ? 140 : 60,
    height: width > 600 ? 140 : 60,
    borderRadius: 10,
    margin: 20,
  },
  selectedMedia: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: "contain",
  },
  textArea: {
    width: '100%',
    height: 500,
    textAlignVertical: 'top',
    borderRadius: 12,
    padding: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    gap: '2%',
    marginTop: 30,
    justifyContent: 'center'
  },
  previewMessage: {
    textAlign: 'center',
    fontSize: 30,
    alignContent: 'center',
    justifyContent: 'center',
    color: 'grey',
    flex: 1,
  },
  textTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  selecContactButton: {
    width: '50%',
    marginTop: 12,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    width: '8%',
    alignSelf: 'center',
    marginLeft: 10,
    height: 35
  },
  customButton1: {
    width: '49%',
    alignSelf: 'center',
  },
  customButton2: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: GlobalStyles.grey,
  },

  //Contact modal styles

  modalContactContainer: {
    padding: 20,
    backgroundColor: GlobalStyles.white,
    borderRadius: 10,
    width: '80%',
    alignSelf: 'center',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: '10%',
    left: '10%',
    height: "60%",
    borderWidth: 5,
    borderColor: GlobalStyles.lightGrey,
  },
  contactContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: width > 600 ? "100%" : 1000,
    marginBottom: 10,
    flexDirection: width > 600 ? "row" : "column",
  },
  input: {
    width: 250,
    marginVertical: 5,
  },
  contactNumber: {
    marginRight: 8,
    fontWeight: "bold",
    fontSize: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
    flex: 1,
    borderRadius: 10,
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: GlobalStyles.blue,
    overflow: "hidden",
    width: "100%",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    padding: 5,
    overflow: "hidden",
    textOverflow: "ellipsis",
    flexWrap: "nowrap",
  },
  actionCell: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.6,
    color: "#fff",
    fontWeight: "bold",
  },
  editButton: {
    marginLeft: 5,
    marginRight: 10,
    alignSelf: "center",
    width: "20%",
  },
  tableContainer: {
    flex: 1,
    padding: 10,
    overflow: "hidden",
    flexWrap: "wrap",
    maxWidth: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: GlobalStyles.blue,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: width > 600 ? 20 : 0,
  },
  headerCell: {
    fontWeight: "bold",
    width: "25%",
    justifyContent: "center",
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 10,
    flex: 1,
  },
  contactTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

});

export default withAuth(MessageCreation, [AUTHORITIES.CUSTOMER_PREMIUM]);
