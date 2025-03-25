import CustomButton from "@/components/CustomButton";
import { CustomTextInput } from "@/components/CustomTextInput";
import TermsAndConditions from "@/components/TermsAndConditions";
import { GlobalStyles } from "@/constants/Colors";
import { BACKEND_API } from "@/constants/Mysc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import { useFocusEffect } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AUTHORITIES } from "../_util/Authorities";
import { useAuth } from "../_util/useAuth";
import { withAuth } from "../_util/withAuth";

import { Picker } from "@react-native-picker/picker";

const deviceWidth = Dimensions.get("window").width;

const RegisterScreen: React.FC = () => {
  const isMobile = deviceWidth < 768;
  const [userType, setUserType] = useState<"Empresa" | "Cliente" | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [hasVisitedTerms, setHasVisitedTerms] = useState<boolean>(false);
  const [termsError, setTermsError] = useState<string>("");
  const navigation = useNavigation();
  const { login } = useAuth();

  useEffect(() => {
    setUserType(null);
    setFormValues({});
    setFormErrors([]);
    setAcceptedTerms(false);
  }, []);

  useFocusEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setUserType(null);
      setFormValues({});
      setFormErrors([]);
      setAcceptedTerms(false);
    });
    return unsubscribe;
  });

  useFocusEffect(
    React.useCallback(() => {
      document.title = "Registrarse";
    }, [])
  );

  // Company fields for the form
  const companyFields = [
    {
      name: "name",
      placeholder: "Floristería Loli S.L.",
      description: "Nombre de la empresa",
    },
    {
      name: "description",
      placeholder: "Descripción de la empresa...",
      description: "Descripción",
    },
    {
      name: "companyType",
      placeholder: "Tipo de empresa",
      description: "Tipo de empresa",
    },
    { name: "nif", placeholder: "F12345678", description: "NIF de la empresa" },
    {
      name: "email",
      placeholder: "floresloli@gmail.com",
      keyboardType: "email-address",
      description: "Email",
    },
    {
      name: "telephone",
      placeholder: "600100200",
      keyboardType: "phone-pad",
      description: "Teléfono",
    },
    {
      name: "address",
      placeholder: "C/ Arquímedes, 3",
      description: "Dirección",
    },
    { name: "city", placeholder: "Sevilla", description: "Ciudad" },

    {
      name: "zipCode",
      placeholder: "41001",
      description: "Código postal",
      keyboardType: "numeric",
    },
    {
      name: "password1",
      placeholder: "******",
      secureTextEntry: true,
      description: "Contraseña",
    },
    {
      name: "password2",
      placeholder: "******",
      secureTextEntry: true,
      description: "Confirmar contraseña",
    },
  ];

  // Customer fields for the form
  const clientFields = [
    {
      name: "name",
      placeholder: "Jesús García",
      description: "Nombre completo",
    },
    {
      name: "email",
      placeholder: "jesus@gmail.com",
      keyboardType: "email-address",
      description: "Email",
    },
    { name: "dni", placeholder: "12345678P", description: "DNI" },
    {
      name: "telephone",
      placeholder: "600100200",
      keyboardType: "phone-pad",
      description: "Teléfono",
    },
    {
      name: "password1",
      placeholder: "******",
      secureTextEntry: true,
      description: "Contraseña",
    },
    {
      name: "password2",
      placeholder: "******",
      secureTextEntry: true,
      description: "Confirmar contraseña",
    },
  ];

  const handleUserTypeSelection = (type: "Empresa" | "Cliente") => {
    setUserType(type);
    setFormErrors([]);
    const initialValues: Record<string, string> = {};
    if (type === "Empresa") {
      companyFields.forEach((field) => {
        initialValues[field.name] = "";
      });
    } else {
      clientFields.forEach((field) => {
        initialValues[field.name] = "";
      });
    }
    setFormValues(initialValues);
  };

  const handleGoBack = () => {
    setUserType(null);
    setFormErrors([]);
    setFormValues({});
  };

  const validateData = async (
    values: Record<
      string,
      string | { uri: string; name: string; type: string }
    >,
    uType: String | null
  ) => {
    const errors: string[] = [];

    const emailRegex = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nifRegex = /^[A-Z]\d{7}[A-J0-9]$/;
    const zipCodeRegex = /^\d{5}$/;
    const phoneRegex = /^\+?\d{9,15}$/;
    const dniRegex = /^\d{8}[A-Z]$/;

    if (uType === "Empresa") {
      if (
        !values.nif ||
        typeof values.nif !== "string" ||
        !nifRegex.test(values.nif)
      ) {
        errors.push("El NIF no es válido.");
      }

      if(typeof values.name === "string" && values.name.length > 100) {
        errors.push("El nombre debe tener 100 caracteres como máximo.");
      }

      if (
        !values.zipCode ||
        typeof values.zipCode !== "string" ||
        !zipCodeRegex.test(values.zipCode)
      ) {
        errors.push("El código postal debe tener 5 dígitos.");
      }

      if (
        !values.city ||
        typeof values.city !== "string" ||
        values.city.trim() === ""
      ) {
        errors.push("La ciudad es obligatoria.");
      }

      if (typeof values.city === "string" && values.city.length > 100) {
        errors.push("La ciudad debe tener 100 caracteres como máximo.");
      }


      if (
        !values.address ||
        typeof values.address !== "string" ||
        values.address.trim() === ""
      ) {
        errors.push("La dirección es obligatoria.");
      }

      if (typeof values.address === "string" && values.address.length > 100) {
        errors.push("La dirección debe tener 100 caracteres como máximo.");
      }
    

      if (
        !values.description ||
        typeof values.description !== "string" ||
        values.description.trim() === ""
      ) {
        errors.push("La descripción es obligatoria.");
      }

      if (typeof values.description === "string" && values.description.length > 1024) {
        errors.push("La descripción debe tener 1024 caracteres como máximo.");
      }

      if (
        !values.companyType ||
        typeof values.companyType !== "string" ||
        ![
          "FLORISTERIA",
          "NOTARIA",
          "FUNERARIA",
          "DESPACHO_DE_ABOGADOS",
          "OTRO",
        ].includes(values.companyType)
      ) {
        errors.push("El tipo de empresa no es válido.");
      }
    }
    if (uType === "Cliente") {
      if (
        !values.dni ||
        typeof values.dni !== "string" ||
        !dniRegex.test(values.dni)
      ) {
        errors.push("El DNI debe tener 8 números y una letra mayúscula.");
      }
    }
    if (
      !values.name ||
      typeof values.name !== "string" ||
      values.name.trim() === ""
    ) {
      errors.push("El nombre es obligatorio.");
    }

    if (typeof values.name === "string" && values.name.length > 100) {
      errors.push("El nombre debe tener 100 caracteres como máximo.");
    }

    if (
      !values.telephone ||
      typeof values.telephone !== "string" ||
      !phoneRegex.test(values.telephone)
    ) {
      errors.push("El número de teléfono no es válido.");
    }

    if (
      !values.email ||
      typeof values.email !== "string" ||
      !emailRegex.test(values.email)
    ) {
      errors.push("El email no es válido.");
    }

    if (
      !values.password1 ||
      typeof values.password1 !== "string" ||
      values.password1.length < 6
    ) {
      errors.push("La contraseña debe tener al menos 6 caracteres.");
    }

    if (typeof values.password1 === "string" && values.password1.length > 20) {
      errors.push("La contraseña debe tener 20 caracteres como máximo.");
    }

    if (values.password1 !== values.password2) {
      errors.push("Las contraseñas no coinciden.");
    }

    return errors;
  };

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      if (!acceptedTerms) {
        setFormErrors(["Debe aceptar los términos y condiciones"]);
        return;
      }
      console.log("handleSubmit llamado con:", values);
      if (Object.keys(values).length === 0) {
        Alert.alert("Información", "Debe completar el formulario");
        return;
      }
      const errors: string[] = await validateData(values, userType);
      if (errors.length !== 0) {
        setFormErrors(errors);
        return;
      } else {
        setFormErrors([]);
      }
      const reqUrl =
        userType === "Empresa"
          ? "api/auth/companies/signup"
          : "api/auth/customers/signup";
      const response = await fetch(BACKEND_API + `/${reqUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) {
        let errorMessage = "Hubo un error inesperado.";
        if (data.errors) {
          errorMessage = Object.values(data.errors).flat().join("\n");
        } else if (data.error) {
          if (data.error.toLowerCase().includes("dni")) {
            errorMessage = "El DNI ya ha sido registrado.";
          } else if (data.error.toLowerCase().includes("email")) {
            errorMessage = "El email ya ha sido registrado.";
          } else {
            errorMessage = data.error;
          }
        }
        throw new Error(errorMessage);
      }
      if (!data.token) {
        throw new Error("No se recibió token de autenticación.");
      }
      await AsyncStorage.setItem("authToken", data.token);
      await login(data.id, data.token, data.roles, data.username, data.name);
      navigation.navigate("home" as never);
    } catch (error: any) {
      setFormErrors([error.message || error]);
      Alert.alert("Error", error.message || error);
    }
  };

  return (
    <View style={styles.container}>
      {!userType ? (
        <View style={styles.selectionContainer}>
          <Text style={styles.formTitle}>¿Qué tipo de usuario eres?</Text>
          <View style={styles.optionsContainer}>
            <View style={styles.optionCard}>
              <Text style={styles.optionTitle}>Soy cliente</Text>
              <Text style={styles.optionDescription}>
                Gestiona el envío de mensajes finales y esquelas digitales a una
                lista de contactos personalizada.
              </Text>
              <CustomButton
                title="Registrarse como cliente"
                onPress={() => handleUserTypeSelection("Cliente")}
                color="blue"
                style={{
                  ...styles.typeButton,
                  ...(isMobile ? {} : { width: 400 }),
                }}
              />
            </View>
            <View style={styles.optionCard}>
              <Text style={styles.optionTitle}>Soy empresa</Text>
              <Text style={styles.optionDescription}>
                Llega a más clientes ofreciendo tus soluciones y servicios
                especializados en el sector funerario.
              </Text>
              <CustomButton
                title="Registrarse como empresa"
                onPress={() => handleUserTypeSelection("Empresa")}
                color="blue"
                style={{
                  ...styles.typeButton,
                  ...(isMobile ? {} : { width: 400 }),
                }}
              />
            </View>
          </View>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.formTitle}>
            {userType === "Empresa"
              ? "Registro de empresa"
              : "Registro de cliente"}
          </Text>

          {userType === "Empresa"
            ? companyFields.map((field, index) => (
                <View
                  key={`company-${field.name}-${index}`}
                  style={[
                    styles.inputContainer,
                    !isMobile && { width: 400, alignSelf: "center" },
                  ]}
                >
                  <Text>{field.description}</Text>
                  {field.name === "companyType" ? (
                    <View style={styles.pickerContainer}>
                      <Picker
                        style={styles.picker}
                        selectedValue={formValues[field.name] || ""}
                        onValueChange={(value) =>
                          setFormValues({ ...formValues, [field.name]: value })
                        }
                      >
                        <Picker.Item
                          label="Selecciona un tipo de empresa"
                          value=""
                        />
                        <Picker.Item label="Floristería" value="FLORISTERIA" />
                        <Picker.Item label="Notaría" value="NOTARIA" />
                        <Picker.Item label="Funeraria" value="FUNERARIA" />
                        <Picker.Item
                          label="Despacho de Abogados"
                          value="DESPACHO_DE_ABOGADOS"
                        />
                        <Picker.Item label="Otro" value="OTRO" />
                      </Picker>
                    </View>
                  ) : (
                    <CustomTextInput
                      placeholder={field.placeholder}
                      secureTextEntry={field.secureTextEntry}
                      value={formValues[field.name] || ""}
                      onChangeText={(text) => {
                        if (field.name === "nif") {
                          let filtered = "";
                          for (let i = 0; i < text.length && i < 9; i++) {
                            if (i == 0) {
                              if (/[A-Z]/.test(text[i].toUpperCase())) {
                                filtered += text[i].toUpperCase();
                              }
                            } else if (i < 8) {
                              if (/[0-9]/.test(text[i])) {
                                filtered += text[i];
                              }
                            } else {
                              if (/[A-Z]/.test(text[i].toUpperCase())) {
                                filtered += text[i].toUpperCase();
                              }
                              if (/[0-9]/.test(text[i])) {
                                filtered += text[i];
                              }
                            }
                          }
                          setFormValues({
                            ...formValues,
                            [field.name]: filtered,
                          });
                        } else if (field.name === "telephone") {
                          let filtered = "";
                          for (let i = 0; i < text.length && i < 9; i++) {
                            if (/[0-9+]/.test(text[i])) {
                              filtered += text[i];
                            }
                          }
                          setFormValues({
                            ...formValues,
                            [field.name]: filtered,
                          });
                        } else if (field.name === "zipCode") {
                          let filtered = "";
                          for (let i = 0; i < text.length && i < 5; i++) {
                            if (/[0-9]/.test(text[i])) {
                              filtered += text[i];
                            }
                          }
                          setFormValues({
                            ...formValues,
                            [field.name]: filtered,
                          });
                        } else {
                          setFormValues({ ...formValues, [field.name]: text });
                        }
                      }}
                      style={{ width: "100%" }}
                    />
                  )}
                </View>
              ))
            : clientFields.map((field, index) => (
                <View
                  key={`client-${field.name}-${index}`}
                  style={[
                    styles.inputContainer,
                    !isMobile && { width: 400, alignSelf: "center" },
                  ]}
                >
                  <Text>{field.description}</Text>
                  <CustomTextInput
                    placeholder={field.placeholder}
                    secureTextEntry={field.secureTextEntry}
                    value={formValues[field.name] || ""}
                    onChangeText={(text) => {
                      if (field.name === "dni") {
                        let filtered = "";
                        for (let i = 0; i < text.length && i < 9; i++) {
                          if (i < 8) {
                            if (/[0-9]/.test(text[i])) {
                              filtered += text[i];
                            }
                          } else {
                            if (/[A-Z]/.test(text[i].toUpperCase())) {
                              filtered += text[i].toUpperCase();
                            }
                          }
                        }
                        setFormValues({
                          ...formValues,
                          [field.name]: filtered,
                        });
                      } else if (field.name === "telephone") {
                        let filtered = "";
                        for (let i = 0; i < text.length && i < 9; i++) {
                          if (/[0-9+]/.test(text[i])) {
                            filtered += text[i];
                          }
                        }
                        setFormValues({
                          ...formValues,
                          [field.name]: filtered,
                        });
                      } else if (field.name === "email") {
                        let filtered = "";
                        for (let i = 0; i < text.length; i++) {
                          if (/[a-zA-Z0-9.@]/.test(text[i])) {
                            filtered += text[i].toLowerCase();
                          }
                        }
                        setFormValues({
                          ...formValues,
                          [field.name]: filtered,
                        });
                      } else {
                        setFormValues({ ...formValues, [field.name]: text });
                      }
                    }}
                    style={{ width: "100%" }}
                  />
                </View>
              ))}

          {formErrors.length > 0 && (
            <View style={styles.errorContainer}>
              {formErrors.map((error, index) => (
                <Text key={`error-${index}`} style={styles.errorText}>
                  {error}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.checkboxContainer}>
            <Checkbox
              value={acceptedTerms}
              onValueChange={(value) => {
                if (!hasVisitedTerms) {
                  setTermsError("Por favor, lee los términos y condiciones antes de aceptarlos.");
                  return;
                }
                setTermsError("");
                setAcceptedTerms(value);
              }}
              color={acceptedTerms ? GlobalStyles.blue : undefined}
            />
            <Text style={styles.checkboxLabel}>Acepto los</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text
                style={[
                  styles.checkboxLabel,
                  { textDecorationLine: "underline", color: GlobalStyles.blue },
                ]}
              >
                términos y condiciones de uso
              </Text>
            </TouchableOpacity>
          </View>
          {termsError ? <Text style={styles.errorText}>{termsError}</Text> : null}

          <CustomButton
            title="Completar registro"
            onPress={() => handleSubmit(formValues)}
            color="blue"
            style={{
              ...styles.submitButton,
              ...(isMobile ? {} : { width: 400 }),
            }}
          />

          <CustomButton
            title="Volver"
            onPress={handleGoBack}
            color="grey"
            style={styles.backButton}
          />

          <Modal
            visible={modalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ScrollView>
                  <Text style={styles.modalTitle}>
                    Términos y condiciones de uso
                  </Text>
                  <TermsAndConditions />
                </ScrollView>
                <CustomButton
                  title="Cerrar"
                  onPress={() => { setModalVisible(false); setHasVisitedTerms(true); }}
                  color="blue"
                  style={styles.modalButton}
                />
              </View>
            </View>
          </Modal>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    fontFamily: GlobalStyles.font,
    flex: 1,
    backgroundColor: GlobalStyles.white,
    padding: 20,
    maxWidth: 700,
    alignSelf: "center",
    paddingTop: 20,
  },
  selectionContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#f2f2f2",

    elevation: 5,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: GlobalStyles.blue,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: GlobalStyles.darkGrey,
    marginBottom: 40,
  },
  buttonBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  typeButton: {
    width: "90%",
    marginHorizontal: 5,
    marginVertical: 10,
    minHeight: 50,
    alignSelf: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
    width: "100%",
  },
  backButton: {
    marginTop: 20,
    backgroundColor: GlobalStyles.grey,
    width: "90%",
    maxWidth: 350,
    alignSelf: "center",
  },
  submitButton: {
    marginTop: 20,
    maxWidth: 350,
    width: "90%",
    alignSelf: "center",
  },
  errorContainer: {
    backgroundColor: "#ffe6e6",
    padding: 10,
    marginBottom: 20,
    borderRadius: 4,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  optionsContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  optionCard: {
    width: deviceWidth < 375 ? "95%" : "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: GlobalStyles.blue,
  },
  optionDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
    color: GlobalStyles.darkGrey,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: GlobalStyles.darkGrey,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: deviceWidth < 375 ? "95%" : "90%",
    maxHeight: "80%",
    backgroundColor: GlobalStyles.white,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: GlobalStyles.darkGrey,
    marginBottom: 20,
  },
  modalButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: GlobalStyles.lightGrey,
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 10,
    marginTop: 5,
  },
  picker: {
    fontSize: 16,
    fontFamily: GlobalStyles.font,
    color: GlobalStyles.darkGrey,
    backgroundColor: GlobalStyles.lightGrey,
    borderColor: GlobalStyles.lightGrey,
    borderWidth: 0,
  },
});

export default withAuth(RegisterScreen, [AUTHORITIES.ANONYMOUS]);
