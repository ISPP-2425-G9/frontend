import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, FlatList, Pressable, Dimensions, Image } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';
import { AUTHORITIES } from '../_util/Authorities';
import { withAuth } from '../_util/withAuth';
import CustomTextInput from '@/components/CustomTextInput';
import { useState } from 'react';
import CustomButton from '@/components/CustomButton';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";



const { width } = Dimensions.get("window");

function MessageCreation() {

  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    customImages: [] as string[],
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

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
        alert("No puedes añadir más de 5 imágenes.");
        return;
      }

      if (filteredAssets.length === 0) {
        alert(`Solo se permiten fotos en formato jpg, jpeg y png. El tamaño máximo es de ${maxSizeMB} MB.`);
        return;
      }

      setFormData({
        ...formData,
        customImages: [...formData.customImages, ...filteredAssets.map(asset => asset.uri)]
      });
    }
  };



  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSaveMessage = () => {
    console.log('Mensaje guardado:', formData);
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

  const [contacts, setContacts] = useState<Contact[]>([{ id: Date.now(), name: "", phone: "", email: "" }]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const [isContactModalVisible, setIsContactModalVisible] = useState(false);

  const handleChangeContact = (field: keyof Contact, value: string) => {
    setNewContact((prev) => ({ ...prev, [field]: value }));
  };



  const addContact = () => {

    if (!newContact.name || !newContact.phone || !newContact.email) {
      window.alert("Todos los campos son obligatorios");
      return;
    }
    if (validateData(newContact)) {
      if (validateData(newContact).length > 0) {
        window.alert(validateData(newContact).join("\n"));
        return;
      }
    }

    setNewContact({ id: Date.now(), name: "", phone: "", email: "" });
    setContacts([...contacts, newContact]);
    console.log("newContact", newContact);
  };

  const removeContact = (id: number) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };



  const validateData = (values: Contact) => {
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
          style={{ width: '100%' }}
          placeholder="Título del mensaje"
          maxLength={100}
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />

        <CustomTextInput
          style={styles.textArea}
          placeholder="Texto personalizado"
          maxLength={20000}
          multiline={true}
          value={formData.text}
          onChangeText={(text) => setFormData({ ...formData, text: text })}
        />

        <View style={styles.buttonContainer}>

          <CustomButton
            color="blue"
            style={styles.customButton1}
            title="Seleccionar imagenes"
            onPress={pickImage}
          />


          <CustomButton
            color="blue"
            style={styles.customButton1}
            title="Seleccionar contactos"
            onPress={handleSelectContacts}
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
          {selectedMedia ?  (
              <Image source={{ uri: selectedMedia }} style={styles.selectedMedia} />
          ) : (
            <Text style={styles.previewMessage}>No se ha seleccionado ningún archivo</Text>
          )}
        </View>

        <View style={styles.mediaItems}>
          <ScrollView horizontal>
            {formData.customImages.length > 0 &&
              formData.customImages.map((uri, index) => (
                <TouchableOpacity key={index} onPress={() => handleMediaPress(uri)}>
                  <Image source={{ uri }} style={styles.customImage} />
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </View>

      {isContactModalVisible && (
        <View style={styles.modalContactContainer}>
          <Pressable style={styles.closeButton} onPress={() => setIsContactModalVisible(false)}>
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
            <CustomButton style={styles.addButton} title="Añadir" onPress={addContact} />
          </View>

          <Text style={styles.contactTitle}>Lista de contactos añadidos</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Nombre</Text>
              <Text style={styles.headerCell}>Teléfono</Text>
              <Text style={styles.headerCell}>Email</Text>
              <Text style={styles.headerCell}>Acción</Text>
            </View>

            <FlatList
              data={contacts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.tableRow}>
                  <Text style={styles.cell}>{item.name}</Text>
                  <Text style={styles.cell}>{item.phone}</Text>
                  <Text style={styles.cell}>{item.email}</Text>
                  <CustomButton
                    title="Eliminar"
                    style={styles.deleteButton}
                    color="red"
                    onPress={() => removeContact(item.id)}
                  />
                  <CustomButton
                    title="Editar"
                    style={styles.editButton}
                    onPress={() => handleEditContact(item)}
                  />
                </View>
              )}
            />
          </View>
        </View>
      )}
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
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

  //Modal styles

  modalContactContainer: {
    padding: 20,
    backgroundColor: GlobalStyles.white,
    borderRadius: 10,
    width: '50%',
    alignSelf: 'center',
    position: 'absolute',
    top: '25  %',
    left: '25%',
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
  deleteButton: {
    marginTop: 10,
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
    maxWidth: width * 0.9,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: GlobalStyles.blue,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: width > 600 ? 120 : 0,
  },
  headerCell: {
    fontWeight: "bold",
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

export default withAuth(MessageCreation, [AUTHORITIES.CUSTOMER]);
