import React, { useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { ThemedView } from '@/components/ThemedView';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
  FlatList,
  Dimensions, 
  StyleProp,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import CustomTextInput from "./CustomTextInput";
import CustomButton from "./CustomButton";
import CustomModal from "./CustomModal";
import { useNotification } from '@/context/NotificationContext';
import { BACKEND_API } from "@/constants/Mysc";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");


type Mode = 'create' | 'edit' | 'view';

type RootStackParamList = {
  "messages/listMyMessages": undefined;
  "messages/createMessage": undefined;
  "messages/editMessage": undefined;
  "messages/viewMessage": undefined;
};

interface FormData {
  title: string;
  body: string;
  customImages: string[];
}

interface Contact {
  id: number;
  name: string;
  telephone: string;
  email: string;
}

interface MessageFormProps {
  isAuthenticated: boolean;
  mode: Mode;
  url: string;
  isOwner: boolean;
  is_newMessage: boolean;
  formData: FormData;
  contacts: Contact[];
  styles: { [key: string]: StyleProp<any> };
}

export default function MessageForm({
  isAuthenticated,
  mode,
  url,
  isOwner,
  is_newMessage,
  formData,
  contacts,
  styles,
}: MessageFormProps) {

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [localFormData, setLocalFormData] = useState<FormData>(formData);
  const [ localContacts, setLocalContacts ] = useState<Contact[]>(contacts);
  const { showNotification } = useNotification();
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string>("");

  const isVisualization = mode === 'view';


  type Contact = {
    id: number;
    name: string;
    telephone: string;
    email: string;
  };
  
  const [newContact, setNewContact] = useState<Contact>({
    id: Date.now(),
    name: "",
    telephone: "",
    email: "",
  });
  
  
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  
  
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  
  const handleChangeContact = (field: keyof Contact, value: string) => {
    setNewContact((prev) => ({ ...prev, [field]: value }));
  };
  
  
  
  const addContact = () => {
  
    if (!newContact.name || !newContact.telephone || !newContact.email) {
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
  
    setNewContact({ id: Date.now(), name: "", telephone: "", email: "" });
    setLocalContacts([...localContacts, newContact]);
  };
  
  const removeContact = (id: number) => {
    setLocalContacts(localContacts.filter((contact) => contact.id !== id));
  };
  
  
  
  const validateContactData = (values: Contact) => {
    const errors: string[] = [];
    const emailRegex = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const telephoneRegex = /^\d{3} \d{3} \d{3}$/;
  
    const telephoneSet = new Set();
    const emailSet = new Set();
  
    if (!values.name || values.name.trim() === "") {
      errors.push("El nombre es obligatorio para el contacto");
    }
  
    if (!values.telephone || !telephoneRegex.test(values.telephone)) {
      errors.push("Por favor, introduce un teléfono válido");
    }
  
    if (!values.email || !emailRegex.test(values.email)) {
      errors.push("El email no es válido.");
    }
  
    localContacts.forEach((contact) => {
      telephoneSet.add(contact.telephone);
    });
  
    if (telephoneSet.has(values.telephone)) {
      errors.push("El teléfono ya ha sido añadido");
    }
  
    localContacts.forEach((contact) => {
      emailSet.add(contact.email);
    }
    );
  
    if (emailSet.has(values.email)) {
      errors.push("El email ya ha sido añadido");
    }
  
    return errors;
  };
  
  const handleSelectContacts = () => {
    setIsContactModalVisible(true);
  };
  
  const handleEditContact = (contact: { id: number; name: string; telephone: string; email: string; }) => {
    removeContact(contact.id);
    setEditingContact(contact);
    setNewContact({
      id: contact.id,
      name: contact.name,
      telephone: contact.telephone,
      email: contact.email,
    });
  };
  
  const setFormData = (newData: FormData) => {
    setLocalFormData(newData);
  };

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
  
        if (localFormData.customImages.length >= 5) {
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
          ...localFormData,
          customImages: [...localFormData.customImages, ...filteredAssets.map(asset => asset.uri)]
        });
      }
    };

  const handleRemoveImage = (uri: string) => {
    const updatedImages = localFormData.customImages.filter(image => image !== uri);
    setFormData({ ...localFormData, customImages: updatedImages });
  };

  const handleMediaPress = (uri: string) => {
    setSelectedMedia(uri);
  };

  const showConfirmationModal = () => {
    setIsConfirmationModalVisible(true);
  }

  const closeConfirmationModal = () => {
    setIsConfirmationModalVisible(false);
  }

  const handleSubmitMessage = async () => {
    
    setLoading(true);

    const method = !is_newMessage ? 'PUT' : 'POST';
    const dataToSend = {
      ...localFormData,
      recipients: localContacts.map(contact => ({
        ...contact,
        telephone: contact.telephone.replace(/\s+/g, '')
      })),
    };

    const recipientEmails = dataToSend.recipients.map((recipient) => recipient.email);
    const errors = validateMessageData(localFormData.title, localFormData.body, recipientEmails);

    closeConfirmationModal();

    if (errors && errors.length > 0) {
      showNotification({
        message: `${errors.join("\n")}`,
        type: "error",
        duration: 3000,
      });
      setLoading(false);
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
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        navigation.navigate("messages/listMyMessages" as never);
      } else {
        const errorText = await response.text();
        throw new Error(`Error en la creación del mensaje 1: ${errorText}`);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.error("Error en la creación del mensaje 2:", error.message);
      showNotification({
        message: `Error en la creación del mensaje: ${error.message}`,
        type: "error",
      });
    }
  };

  const validateMessageData = (title: string, body: string, recipients: string[]) => {
    const errors: string[] = [];


    if (!title || title.trim() === "") {
      errors.push("El título no puede estar vacío");
    }

    if (!body || body.trim() === "") {
      errors.push("El cuerpo del mensaje no puede estar vacío");
    }

    if (recipients.length === 0) {
      errors.push("Debe añadir al menos un contacto");
    }

    setIsConfirmationModalVisible(true);

    return errors;
  };

  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const handleVerifyCode = async () => {
    console.log("Por terminar")
  };



   if (!isAuthenticated) {
      return (
        <ThemedView style={styles.container}>
          <Text style={styles.title}>
            Debes iniciar sesión para poder acceder a esta sección
          </Text>
        </ThemedView>
      );
    }

  return (
    <>
      {isVisualization || isOwner ? (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.formContainer}>
            <Text style={styles.textTitle}>
              {is_newMessage ? "Crea tu mensaje personalizado" : (isVisualization ? "Tu mensaje" : "Actualiza tu mensaje")}
            </Text>

            <CustomTextInput
              style={{ width: "100%" }}
              placeholder="Título del mensaje"
              maxLength={80}
              value={localFormData.title}
              onChangeText={(text) => setFormData({ ...localFormData, title: text })}
              editable={isOwner}
            />

            <CustomTextInput
              style={styles.textArea}
              placeholder="Texto personalizado"
              maxLength={2000}
              multiline
              value={localFormData.body}
              onChangeText={(text) => setFormData({ ...localFormData, body: text })}
              editable={isOwner}
            />
            {isOwner && !isVisualization && (
              <View>
                <View style={styles.buttonContainer}>
                  <CustomButton
                    color="blue"
                    style={styles.customButton1}
                    title={is_newMessage ? "Seleccionar imágenes" : "Actualizar imágenes"}
                    onPress={pickImage}
                  />
                  <CustomButton
                    color="blue"
                    style={styles.customButton1}
                    title={is_newMessage ? "Seleccionar contactos" : "Actualizar contactos"}
                    onPress={handleSelectContacts}
                  />

                  <CustomButton
                    color="grey"
                    style={styles.customButton2}
                    title={"Volver"}
                    onPress={() => navigation.navigate("messages/listMyMessages" as never)}
                  />
                </View>
                <CustomButton
                  color="grey"
                  style={styles.customButton3}
                  title={is_newMessage ? "Guardar mensaje" : "Actualizar mensaje"}
                  onPress={showConfirmationModal}
                />
              </View>
            )}
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
                {localFormData.customImages.length > 0 &&
                  localFormData.customImages.map((uri, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleMediaPress(uri)}
                    >
                      <Image source={{ uri }} style={styles.customImage} />
                      {selectedMedia === uri && (
                        <View style={{ position: "absolute", top: 25, left: 25 }}>
                          <AntDesign name="checkcircleo" size={20} color="green" />
                        </View>
                      )}
                      {!isVisualization && isOwner && (
                        <TouchableOpacity
                          onPress={() => handleRemoveImage(uri)}
                          style={{
                            position: 'absolute',
                            top: 25,
                            right: 25,
                          }}
                        >
                          <AntDesign name="closecircle" size={20} color="red" />
                        </TouchableOpacity>
                      )}
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
                  placeholder="Teléfono"
                  value={newContact.telephone}
                  maxLength={11}
                  keyboardType="phone-pad"
                  onChangeText={(text) => {
                    const numericText = text.replace(/\D/g, "");
                    const formattedText = numericText.replace(/(\d{3})/g, "$1 ").trim();
                    handleChangeContact("telephone", formattedText);
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
                      data={localContacts}
                      keyExtractor={(item) => item.id.toString()}
                      nestedScrollEnabled={true}
                      renderItem={({ item }) => (
                        <View style={styles.tableRow}>
                          <Text style={styles.cell}>{item.name}</Text>
                          <Text style={styles.cell}>{item.telephone}</Text>
                          <Text style={styles.cell}>{item.email}</Text>
                          <View style={styles.actionCell}>
                            <CustomButton
                              title="Editar"
                              textStyle={{ fontSize: 12 }}
                              style={styles.editButton}
                              onPress={() => handleEditContact(item)}
                            />
                            <CustomButton
                              title="Eliminar"
                              textStyle={{ fontSize: 12 }}
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

          {isConfirmationModalVisible && (
            <CustomModal
              visible={isConfirmationModalVisible}
              onClose={closeConfirmationModal}
              title={"¿Desea guardar el mensaje?"}
              style={styles.modalStyle2}
            >
              <View style={styles.buttonContainer2}>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={handleSubmitMessage}
                >
                  <Text style={styles.buttonText}>Aceptar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={closeConfirmationModal}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </CustomModal>
          )}
        </ScrollView>
      ) : (
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}> Ingresa el código</Text>
          <CustomTextInput
            placeholder="Código"
            value={code}
            maxLength={5}
            onChangeText={(text) => setCode(text)}
            style={styles.input}
          />
          <CustomButton
            style={styles.addButton}
            title="Enviar"
            onPress={handleVerifyCode}
          />
        </View>
      )}
    </>
  );
}
