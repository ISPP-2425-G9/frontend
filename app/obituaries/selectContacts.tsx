import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import CustomButton from "@/components/CustomButton";
import { CustomTextInput } from "@/components/CustomTextInput";
import { useRoute, RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp  } from "@react-navigation/native";
import CustomModal from "@/components/CustomModal";
import { GlobalStyles } from "@/constants/Colors";
import { BACKEND_API } from "@/constants/Mysc";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { withAuth } from "../_util/withAuth";
import { AUTHORITIES } from "../_util/Authorities";
import useAuth from "@/hooks/useAuth";
import { ThemedView } from "@/components/ThemedView";

const { width } = Dimensions.get("window");



type RootStackParamList = {
  "obituaries/selectContacts": {
    jsonData: string,
    is_newObituary: boolean,
    obituaryId: number,
    is_mine: boolean
  };
  "obituaries/listMyObituaries": undefined;
  "obituaries/loadCertificate": { 
    jsonData: string, 
    is_newObituary: boolean, 
    obituaryId: number
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
  const is_mine = route.params?.is_mine;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([
    { id: Date.now(), name: "", phone: "", email: "" },
  ]);
  const [combinedData, setCombinedData] = useState<any>({});
  const [userRole, setUserRole] = useState<string | null>(null);

  const hasError =
    jsonData === "" ||
    is_newObituary === undefined ||
    obituaryId === undefined ||
    is_mine === undefined;
  useFocusEffect(
    useCallback(() => {
      if (is_newObituary) {
        setContacts([{ id: Date.now(), name: "", phone: "", email: "" }]);
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
      setContacts([{ id: Date.now(), name: '', phone: '', email: '' }]);
      setCombinedData({});
    };
  }, []);


  useEffect(() => {
    if (is_newObituary) {
      setContacts([{ id: Date.now(), name: "", phone: "", email: "" }]);
    } else {
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
            contact.phone = contact.telephone;
            delete contact.telephone;
          });

          setContacts(contactData);
        } catch (error) {
          console.error("Error al cargar los contactos:");
        }
      };

      fetchContactData();
    }
  }, [is_newObituary, obituaryId]);

  useEffect(() => {
    const updateData = {
      ...JSON.parse(jsonData),
      contacts,
    };
    setCombinedData(updateData);
  }, [contacts, jsonData]);

  const handleChange = (id: number, field: keyof Contact, value: string) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );
  };

  const validateData = (values: Contact) => {
    const errors: string[] = [];
    const emailRegex = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\+?\d{9,15}$/;

    if (!values.name || values.name.trim() === "") {
      errors.push("El nombre es obligatorio para el contacto");
    }

    if (!values.phone || !phoneRegex.test(values.phone)) {
      errors.push("Por favor, introduce un teléfono válido (sin prefijo)");
    }

    if (!values.email || !emailRegex.test(values.email)) {
      errors.push("El email no es válido.");
    }

    return errors;
  };

  const addContact = () => {
    setContacts([
      { id: Date.now(), name: "", phone: "", email: "" },
      ...contacts,
    ]);
  };

  const removeContact = (id: number) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((contact) => contact.id !== id));
    } else {
      window.alert("Debe haber al menos un contacto.");
    }
  };

  const createObituary = async () => {
    const contactsWithoutIds = contacts.map(({ id, ...rest }) => rest);
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
    const contactsWithoutIds = contacts.map(({ id, ...rest }) => rest);

    const dataToSend = {
        ...combinedData,
        contacts: contactsWithoutIds,
    };

    navigation.navigate("obituaries/loadCertificate", { 
        jsonData: JSON.stringify(dataToSend) ,
        is_newObituary, 
        obituaryId
    });
};

  const showConfirmationModal = async () => {
    const errors: string[] = [];

    const phoneSet = new Set();
    const emailSet = new Set();

    try {
      for (const contact of contacts) {
        const contactErrors = validateData(contact);
        if (emailSet.has(contact.email)) {
          errors.push("No se pueden repetir los correos electrónicos");
        } else {
          emailSet.add(contact.email);
        }

        if (phoneSet.has(contact.phone)) {
          errors.push("No se pueden repetir los números de teléfono");
        } else {
          phoneSet.add(contact.phone);
        }

        if (contactErrors.length > 0) {
          errors.push(...contactErrors.slice(0, 3 - errors.length));
        }
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
    console.log("is_mine", is_mine);
  
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

  return isAuthenticated ? (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        {is_newObituary ? (
          <Text style={styles.title}>Agrega a tus contactos</Text>
        ) : (
          <Text style={styles.title}>Edita a tus contactos</Text>
        )}

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.contactContainer}>
              <Text style={styles.contactNumber}>{index + 1}.</Text>
              <CustomTextInput
                placeholder="Nombre"
                value={item.name}
                onChangeText={(text) => handleChange(item.id, "name", text)}
                style={styles.input}
              />
              <CustomTextInput
                placeholder="Teléfono (sin prefijo)"
                value={item.phone}
                maxLength={9}
                keyboardType="phone-pad"
                onChangeText={(text) => {
                  const numericText = text.replace(/\D/g, "");
                  handleChange(item.id, "phone", numericText);
                }}
                style={styles.input}
              />
              <CustomTextInput
                placeholder="Email"
                value={item.email}
                keyboardType="email-address"
                onChangeText={(text) => handleChange(item.id, "email", text)}
                style={styles.input}
              />

              {index === 0 && (
                <CustomButton
                  title="Añadir otro"
                  onPress={addContact}
                  style={styles.deleteButton}
                />
              )}

              {index !== 0 && (
                <CustomButton
                  title="Eliminar"
                  color="red"
                  onPress={() => removeContact(item.id)}
                  style={styles.deleteButton}
                />
              )}
            </View>
          )}
        />
      </View>

      <View style={styles.divider} />
      <View style={styles.buttonContainer}>

        


      {
        is_newObituary ? (
          <>
            <CustomButton
              title={"Cree su propia esquela"}
              onPress={() => showConfirmationModal()}
              style={styles.saveButton}
            />

            <CustomButton
              title={"Cree y envie su esquela para un ser querido"}
              onPress={() => showConfirmationModal()}
              style={styles.saveButton}
            />
          </>
        ) : is_mine ? (
          console.log("is_mine", is_mine),
          <CustomButton
            title={"Actualice su esquela"}
            onPress={() => showConfirmationModal()}
            style={styles.saveButton}
          />
        ) : (
          <CustomButton
            title={"Actualice el certificado de defunción"}
            onPress={() => showConfirmationModal()}
            style={styles.saveButton}
          />
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
              onPress={() => handleSubmit()}
            >
            <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleCloseModal()}
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
  contactNumber: {
    marginRight: 8,
    fontWeight: "bold",
    fontSize: 20,
  },
  contactContainer: {
    alignSelf: "center",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width > 600 ? "100%" : "80%",
    marginBottom: 10,
    flexDirection: "row",
  },
  deleteButton: {
    marginLeft: 10,
    alignSelf: "center",
    width: "20%",
  },
  input: {
    marginLeft: 10,
    width: "30%",
  },
  saveButton: {
    width: width > 600 ? "60%" : 160,
    height: width > 600 ? "100%" : 70,
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
    width: width > 600 ? "40%" : "80%",
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
  },
});

export default withAuth(SelectContacts, [AUTHORITIES.CUSTOMER])