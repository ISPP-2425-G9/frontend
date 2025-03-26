import React, { useState, useEffect } from "react";
import { View, Text, Alert, FlatList, StyleSheet, TouchableOpacity, Dimensions, Platform } from "react-native";
import CustomButton from "@/components/CustomButton";
import { CustomTextInput } from "@/components/CustomTextInput";
import { useRoute, RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import CustomModal from "@/components/CustomModal";
import { GlobalStyles } from "@/constants/Colors";
import { BACKEND_API } from "@/constants/Mysc";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { withAuth } from "../_util/withAuth";
import { AUTHORITIES } from "../_util/Authorities";
import useAuth from "@/hooks/useAuth";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");



type RootStackParamList = {
  "obituaries/selectContacts": {
    jsonData: string,
    is_newObituary: boolean,
    obituaryId: number,
    is_mine: boolean,
    isMine: boolean
  };
  "obituaries/listMyObituaries": undefined;
  "obituaries/loadCertificate": {
    jsonData: string,
    is_newObituary: boolean,
    obituaryId: number,
    is_mine: boolean
  };
};

type SelectContactsRouteProp = RouteProp<
  RootStackParamList,
  "obituaries/selectContacts"
>;

type Contact = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

function SelectContacts() {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<SelectContactsRouteProp>();

  const jsonData = route.params?.jsonData ?? "";
  const is_newObituary = route.params?.is_newObituary;
  const obituaryId = route.params?.obituaryId;
  const is_mine = route.params?.is_mine ?? route.params?.isMine;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [newContact, setNewContact] = useState<Contact>({
    id: Date.now(),
    name: "",
    phone: "",
    email: "",
  });
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [combinedData, setCombinedData] = useState<any>({});
  const [userRole, setUserRole] = useState<string | null>(null);

  const [editingContact, setEditingContact] = useState<Contact | null>(null);


  const hasError =
    jsonData === "" ||
    is_newObituary === undefined ||
    obituaryId === undefined ||
    is_mine === undefined;
  useFocusEffect(
    useCallback(() => {
      if (is_newObituary) {
        setNewContact({ id: Date.now(), name: "", phone: "", email: "" });
        setContacts([]);
        setCombinedData({});
      }
    }, [is_newObituary])
  );

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userData = await AsyncStorage.getItem("user_data");
        if (userData !== null) {
          const parsedData = JSON.parse(userData);
          const roles = parsedData.roles;
          if (roles && roles.includes("CUSTOMER_FREE")) {
            setUserRole("CUSTOMER_FREE");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserRole();

    return () => {
      setContacts([]);
      setCombinedData({});
    };
  }, []);


  useEffect(() => {
    if (is_newObituary) {
      setContacts([]);
    } else {
      if (obituaryId !== undefined) {
        const fetchContactData = async () => {
          try {
            const authToken = await AsyncStorage.getItem("authToken");
            if (!authToken)
              throw new Error("No se encontró un token de autenticación");

            const response = await fetch(
              BACKEND_API + `/api/receiver/getReceivers/obituary/${obituaryId}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken.trim()}`,
                },
              }
            );

            if (!response.ok) throw new Error("Error al obtener los datos");

            const contactData = await response.json();
            contactData.forEach((contact: any) => {
              const rawPhone = contact.telephone;
              contact.phone = rawPhone.replace(/(\d{3})(?=\d)/g, '$1 ').trim();

              delete contact.telephone;
            });


            setContacts(contactData);
          } catch (error) {
            console.error("Error al cargar los contactos:");
          }
        };

        fetchContactData();
      }
    }
  }, [is_newObituary, obituaryId]);

  useEffect(() => {
    let updateData = {};
    if (jsonData && jsonData.trim() !== '') {
      try {
        updateData = Object.assign({}, JSON.parse(jsonData), { contacts });
      } catch (e) {
        console.error('Error al analizar JSON:', e);
      }
    } else {
      console.error('jsonData es inválido:', jsonData);
    }
    setCombinedData(updateData);
  }, [contacts, jsonData]);

  const handleChange = (field: keyof Contact, value: string) => {
    setNewContact((prev) => ({ ...prev, [field]: value }));
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

  const addContact = () => {

    if (!newContact.name || !newContact.phone || !newContact.email) {
      window.alert("Todos los campos son obligatorios");
      return;
    }
    const errors = validateData(newContact)

      if (errors && errors.length > 0) {
        window.alert(errors.join("\n"));
        return;
      }

    setNewContact({ id: Date.now(), name: "", phone: "", email: "" });
    setContacts([...contacts, newContact]);
    console.log("newContact", newContact);
  };

  const removeContact = (id: number) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
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




  const showConfirmationModal = async () => {
    const errors: string[] = [];
    const phoneSet = new Set();
    const emailSet = new Set();

    try {

      if (contacts.length < 1) {
        window.alert("Por favor, añada al menos un contacto");
        return;
      }

      if (errors.length !== 0) {
        throw new Error(`Hay error(es) en su formulario: ${errors.join(", ")}`);
      }

      if (is_mine) {
        if (userRole === 'CUSTOMER_FREE') {

          setModalMessage("¿Desea guardar su propia esquela?\n ⚠️¡Recuerde que debe contratar nuestro plan para que su esquela sea enviada!");
        } else {
          setModalMessage("¿Desea guardar su propia esquela?");
        }
      } else {
        setModalMessage("¿Desea crear y enviar una esquela para un ser querido?");
      }

      setModalVisible(true);
    } catch (error: any) {
      if (Platform.OS === "web") {
        window.alert("Error: " + error.message);
      } else {
        Alert.alert("Error", error.message || error);
      }
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSubmit = async () => {

    try {
      if (is_mine) {
        await createObituary();
      } else {
        moveToNextScreen();
      }
      setModalVisible(false);
    } catch (error: any) {
      if (Platform.OS === "web") {
        window.alert("Error: " + error.message);
      } else {
        Alert.alert("Error", error.message || error);
      }
    }
  };

  const createObituary = async () => {

    const contactsWithoutIds = contacts.map(({ id, phone, ...rest }) => ({
      ...rest,
      phone: phone.replace(/\s+/g, '')
    }));

    const dataToSend = {
      ...combinedData,
      contacts: contactsWithoutIds,
      isMine: is_mine,
    };

    const url = is_newObituary
      ? BACKEND_API + `/api/obituary/create`
      : BACKEND_API + `/api/obituary/update/${obituaryId}`;

    const method_type = is_newObituary ? "POST" : "PUT";

    try {

      const authToken = await AsyncStorage.getItem("authToken");
      const response = await fetch(url, {
        method: method_type,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        navigation.navigate("obituaries/listMyObituaries" as never);
      } else {
        throw new Error("Error en la creación de la esquela");
      }
    } catch (error) {
      const errormssg = is_newObituary
        ? "Error al crear la esquela.Por favor, inténtelo de nuevo."
        : "Error al actualizar la esquela.Por favor, inténtelo de nuevo.";
      window.alert(errormssg);
    }
  };

  const moveToNextScreen = () => {

    const contactsWithoutIds = contacts.map(({ id, phone, ...rest }) => ({
      ...rest,
      phone: phone.replace(/\s+/g, '')
    }));

    const dataToSend = {
      ...combinedData,
      contacts: contactsWithoutIds,
    };

    navigation.navigate("obituaries/loadCertificate", {
      jsonData: JSON.stringify(dataToSend),
      is_newObituary,
      obituaryId,
      is_mine
    });
  };


  return isAuthenticated ? (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        {is_newObituary ? (
          <Text style={styles.title}>Agrega a tus contactos</Text>
        ) : (
          <Text style={styles.title}>Edita a tus contactos</Text>
        )}
        <View style={styles.contactContainer}>
          <CustomTextInput
            placeholder="Nombre"
            value={newContact.name}
            maxLength={50}
            onChangeText={(text) => {handleChange("name", text)}}
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
              handleChange("phone", formattedText);
            }}

            style={styles.input}
          />
          <CustomTextInput
            placeholder="Email"
            value={newContact.email}
            maxLength={50}
            keyboardType="email-address"
            onChangeText={(text) => {handleChange("email", text)}}
            style={styles.input}
          />
          <CustomButton style={styles.button} title="Añadir" onPress={addContact} />
        </View>


        <Text style={styles.title}>Lista de contactos añadidos</Text>
        <ScrollView style={styles.tableContainer} horizontal>
          <View>

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
                    onPress={() => {removeContact(item.id)}}
                  />
                  <CustomButton
                    title="Editar"
                    style={styles.editButton}
                    onPress={() => {handleEditContact(item)}}
                  />

                </View>
              )}
            />
          </View>
        </ScrollView>



      </View><View style={styles.divider} />
      <View style={styles.buttonContainer}>


        {
          is_newObituary ? (
            <CustomButton
              title={is_mine ? "Crear esquela" : "Subir certificado"}
              onPress={() => {showConfirmationModal()}}
              style={styles.saveButton}
            />
          ) : (
            is_mine && (
              <CustomButton
                title={"Actualizar esquela"}
                onPress={() =>{showConfirmationModal()}}
                style={styles.saveButton}
              />
            )
          )
        }
      </View>
      {modalVisible && (
        <CustomModal
          visible={modalVisible}
          onClose={handleCloseModal}
          title={modalMessage}
          style={styles.modalStyle}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {handleSubmit()}}
            >
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {handleCloseModal()}}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
      )}
    </View>
  ) : (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Debes iniciar sesión para poder acceder a esta sección</Text>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  dataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 120,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  contactContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: width > 600 ? "100%" : 1000,
    marginBottom: 10,
    flexDirection: width > 600 ? "row" : "column",
  },
  deleteButton: {
    marginLeft: 10,
    alignSelf: "center",
    width: "20%",
  },
  editButton: {
    marginLeft: 5,
    marginRight: 10,
    alignSelf: "center",
    width: "20%",
  },
  input: {
    marginRight: 10,
    width: "30%",
  },
  saveButton: {
    width: width > 600 ? "60%" : 160,
    height: width > 600 ? "100%" : 50,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1%",
    flexDirection: "row",
    width: "35%",
    gap: "2%",
  },
  modalStyle: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: width > 600 ? "40%" : "90%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: GlobalStyles.blue,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    marginTop: width > 600 ? 0 : 10,
  },
  headerCell: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 10,
    flex: 1,
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
});


export default withAuth(SelectContacts, [AUTHORITIES.CUSTOMER])