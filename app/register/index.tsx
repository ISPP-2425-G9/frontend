import CustomButton from "@/components/CustomButton";
import { CustomTextInput } from "@/components/CustomTextInput";
import TermsAndConditions from "@/components/TermsAndConditions";
import { InputField } from '@/components/TextInputArraysForm';
import { ThemedText } from "@/components/ThemedText";
import { GlobalStyles } from "@/constants/Colors";
import { BACKEND_API } from "@/constants/Mysc";
import { useNotification } from "@/context/NotificationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import { useFocusEffect } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert, Animated, Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView, StyleSheet,
  View
} from 'react-native';
import { AUTHORITIES } from "../_util/Authorities";
import { useAuth } from "../_util/useAuth";
import { withAuth } from "../_util/withAuth";

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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const { showNotification } = useNotification();

  useEffect(() => {
    setUserType(null);
    setFormValues({});
    setFormErrors([]);
    setAcceptedTerms(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      document.title = "Registrarse";
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
      setUserType(null);
      setFormValues({});
      setFormErrors([]);
      setAcceptedTerms(false);
      setHasVisitedTerms(false);
    }, [])
  );

  // Company fields for the form
  const companyFields: InputField[] = [
    {
      name: "name",
      placeholder: "Empresa S.L.",
      description: "Nombre",
      maxLength: 50
    },
    {
      name: "description",
      placeholder: "Descripción",
      description: "Descripción",
      maxLength: 500,
    },
    {
      name: "companyType",
      placeholder: "Tipo de empresa",
      description: "Tipo",
    },
    { name: "nif", placeholder: "A01024892", description: "NIF" },
    {
      name: "email",
      placeholder: "ejemplo@mail.com",
      keyboardType: "email-address",
      description: "Email",
      maxLength: 50,
    },
    {
      name: "telephone",
      placeholder: "600 000 000",
      keyboardType: "phone-pad",
      description: "Teléfono",
    },
    {
      name: "address",
      placeholder: "Calle, número, piso, etc.",
      description: "Dirección",
      maxLength: 75,
    },
    {
      name: "city", placeholder: "Ciudad", description: "Ciudad", maxLength: 50,
    },

    {
      name: "zipCode",
      placeholder: "41012",
      description: "Código postal",
      keyboardType: "numeric",
    },
    {
      name: "password1",
      placeholder: "******",
      secureTextEntry: true,
      description: "Contraseña",
      maxLength: 36,
    },
    {
      name: "password2",
      placeholder: "******",
      secureTextEntry: true,
      description: "Confirmar contraseña",
      maxLength: 36,
    },
  ];

  // Customer fields for the form
  const clientFields: InputField[] = [
    {
      name: "name",
      placeholder: "Nombre y apellidos",
      description: "Nombre completo",
      maxLength: 50,
    },
    {
      name: "email",
      placeholder: "ejemplo@mail.com",
      keyboardType: "email-address",
      description: "Email",
      maxLength: 50,
    },
    { name: "dni", placeholder: "65450808F", description: "DNI" },
    {
      name: "telephone",
      placeholder: "600 000 000",
      keyboardType: "phone-pad",
      description: "Teléfono",
    },
    {
      name: "password1",
      placeholder: "******",
      secureTextEntry: true,
      description: "Contraseña",
      maxLength: 36,
    },
    {
      name: "password2",
      placeholder: "******",
      secureTextEntry: true,
      description: "Confirmar contraseña",
      maxLength: 36,
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
    uType: string | null
  ) => {
    const errors: string[] = [];

    const emailRegex = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nifRegex = /^[A-Z]\d{7}[A-J0-9]$/;
    const zipCodeRegex = /^\d{5}$/;
    const phoneRegex = /^\d{9}$/;

    const validatePhone = (phone: string) => {
      const digitsOnly = phone.replace(/\s/g, '');
      return phoneRegex.test(digitsOnly);
    };

    const validateDni = (dni: string) => {
      const dniRegex = /^\d{8}[A-Z]$/;
      if (!dniRegex.test(dni)){
        {
          showNotification({
            message: "El DNI debe tener 8 números y una letra mayúscula",
            type: "error",
          });
        }
        return false
      }
      const dniNumber = dni.slice(0, 8);
      const dniLetter = dni.charAt(8);
      const dniLetters = "TRWAGMYFPDXBNJZSQVHLCKE";
      const dniIndex = parseInt(dniNumber, 10) % 23;
      const expectedLetter = dniLetters.charAt(dniIndex);
      return dniLetter === expectedLetter;
    };

    

    if (uType === "Empresa") {
      if (
        !values.nif ||
        typeof values.nif !== "string" ||
        !nifRegex.test(values.nif)
      ) showNotification({
        message: "El NIF no es válido",
        type: "error",
      });

      if (
        !values.zipCode ||
        typeof values.zipCode !== "string" ||
        !zipCodeRegex.test(values.zipCode)
      ) showNotification({
        message: "El código postal no es válido",
        type: "error",
      });

      if (
        !values.city ||
        typeof values.city !== "string" ||
        values.city.trim() === ""
      ) showNotification({
        message: "La ciudad es obligatoria",
        type: "error",
      });

      if (
        !values.address ||
        typeof values.address !== "string" ||
        values.address.trim() === ""
      ) showNotification({
        message: "La dirección es obligatoria",
        type: "error",
      });

      if (
        !values.description ||
        typeof values.description !== "string" ||
        values.description.trim() === ""
      ) showNotification({
        message: "La descripción es obligatoria",
        type: "error",
      });

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
        !validateDni(values.dni)
      ) showNotification({
        message: "El DNI no es válido",
        type: "error",
      });
    }
    if (
      !values.name ||
      typeof values.name !== "string" ||
      values.name.trim() === ""
    ) showNotification({
      message: "El nombre es obligatorio",
      type: "error",
    });

    if (
      !values.telephone ||
      typeof values.telephone !== "string" ||
      !validatePhone(values.telephone)
    ) showNotification({
      message: "El teléfono no es válido",
      type: "error",
    });

    if (
      !values.email ||
      typeof values.email !== "string" ||
      !emailRegex.test(values.email)
    ) showNotification({
      message: "El email no es válido",
      type: "error",
    });

    if (
      !values.password1 ||
      typeof values.password1 !== "string" ||
      values.password1.length < 6
    )
    showNotification({
      message: "La contraseña debe tener al menos 6 caracteres",
      type: "error",
    });

    if (values.password1 !== values.password2) {
      showNotification({
        message: "Las contraseñas no coinciden",
        type: "error",
      });
    }

    return errors;
  };

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      if (!acceptedTerms) {
        showNotification({
          message: "Debes aceptar los términos y condiciones",
          type: "error",
        });
        return;
      }
      const modifiedValues = {
        ...values,
        telephone: values.telephone.replace(/\s/g, '')
      };
      if (Object.keys(modifiedValues).length === 0) {
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
        body: JSON.stringify(modifiedValues),
      });
      const data = await response.json();
      if (!response.ok) {
        let errorMessage = "Hubo un error inesperado.";
        if (data.errors) {
          errorMessage = Object.values(data.errors).flat().join("\n");
        } else if (data.error) {
          if (data.error.toLowerCase().includes("dni")) {
            errorMessage = "El DNI ya ha sido registrado";
          } else if (data.error.toLowerCase().includes("email")) {
            errorMessage = "El email ya ha sido registrado";
          } else {
            errorMessage = data.error;
          }
        }
        throw new Error(errorMessage);
      }
      if (!data.token) {
        throw new Error("No se recibió token de autenticación");
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
        <Animated.View
          style={[
            styles.selectionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ThemedText style={styles.ThemedText}>¿Qué tipo de usuario eres?</ThemedText>
          <View style={styles.optionsContainer}>
            <View style={styles.optionCard}>
              <ThemedText style={styles.optionTitle}>Soy un cliente</ThemedText>
              <ThemedText style={styles.optionDescription}>
                Gestiona el envío de mensajes finales y esquelas digitales a una
                lista de contactos personalizada.
              </ThemedText>
              <CustomButton
                title="Registrarse como cliente"
                onPress={() => { handleUserTypeSelection("Cliente") }}
                color="blue"
                style={{
                  ...styles.typeButton,
                }}
              />
            </View>
            <View style={styles.optionCard}>
              <ThemedText style={styles.optionTitle}>Soy una empresa</ThemedText>
              <ThemedText style={styles.optionDescription}>
                Llega a más clientes ofreciendo tus soluciones y servicios
                especializados en el sector funerario.
              </ThemedText>
              <CustomButton
                title="Registrarse como empresa"
                onPress={() => { handleUserTypeSelection("Empresa") }}
                color="blue"
                style={{
                  ...styles.typeButton,
                }}
              />
              <ThemedText style={styles.registerText}>
                        ¿Ya tienes una cuenta?{' '}
                        <Pressable onPress={() => { navigation.navigate('login/index' as never) }}>
                          <ThemedText style={styles.loginLink}>Inicia sesión</ThemedText>
                        </Pressable>
                      </ThemedText>
            </View>
          </View>
        </Animated.View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <ThemedText style={styles.ThemedText}>
              {userType === "Empresa"
                ? "Registro de empresa"
                : "Registro de cliente"}
            </ThemedText>

            {userType === "Empresa"
              ? companyFields.map((field, index) => (
                <View
                  key={`company-${field.name}-${index}`}
                  style={[
                    styles.inputContainer,
                    !isMobile && { width: 400, alignSelf: "center" },
                  ]}
                >
                  <ThemedText>{field.description}</ThemedText>
                  {field.name === "companyType" ? (
                    <View style={styles.pickerContainer}>
                      <Picker
                        style={[
                                  styles.picker,
                                  Platform.OS === 'web' ? { outline: 'none' } : {},
                                ]}
                        selectedValue={formValues[field.name] || ""}
                        onValueChange={(value) => { setFormValues({ ...formValues, [field.name]: value }) }
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
                      maxLength={field.maxLength}
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
                          let digits = text.replace(/\D/g, '').slice(0, 9);
                          let formatted = digits.match(/.{1,3}/g)?.join(' ') || '';
                          setFormValues({ ...formValues, [field.name]: formatted });
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
                  <ThemedText>{field.description}</ThemedText>
                  <CustomTextInput
                    placeholder={field.placeholder}
                    secureTextEntry={field.secureTextEntry}
                    value={formValues[field.name] || ""}
                    maxLength={field.maxLength}
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
                        let digits = text.replace(/\D/g, '').slice(0, 9);
                        let formatted = digits.match(/.{1,3}/g)?.join(' ') || '';
                        setFormValues({ ...formValues, [field.name]: formatted });
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


            <View style={styles.checkboxContainer}>
              <Checkbox
                value={acceptedTerms}
                onValueChange={(value) => {
                  if (!hasVisitedTerms) {
                    showNotification({
                      message: "Por favor, lee los términos y condiciones antes de aceptarlos.",
                      type: "error",
                    });
                    return;
                  }
                  setTermsError("");
                  setAcceptedTerms(value);
                }}
                color={acceptedTerms ? GlobalStyles.blue : undefined}
              />
              <ThemedText style={styles.checkboxLabel}>
                Acepto los{" "}
                <ThemedText
                  onPress={() => setModalVisible(true)}
                  style={[
                    { textDecorationLine: "underline", color: GlobalStyles.blue },
                  ]}
                >
                  términos y condiciones de uso
                </ThemedText>
              </ThemedText>
            </View>
            {termsError ? <ThemedText style={styles.errorText}>{termsError}</ThemedText> : null}

            <CustomButton
              title="Registrarse"
              onPress={() => { handleSubmit(formValues) }}
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
          </View>


          <Modal
            visible={modalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => { setModalVisible(false) }}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ScrollView>
                  <ThemedText style={styles.modalTitle}>
                    Términos y condiciones de uso
                  </ThemedText>
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
    paddingHorizontal: 20,
    alignSelf: 'center',
    paddingTop: 20,
    width: '100%',
  },
  selectionContainer: {
    marginTop: '5%',
    paddingHorizontal: 0,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '90%',
    maxWidth: 550,
    alignSelf: 'center',
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
  formLabel: {
    fontFamily: GlobalStyles.font,
    fontSize: 16, // Ajusta el tamaño según necesites
    color: GlobalStyles.darkGrey, // Opcional: cambiar color
  },
  buttonBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  typeButton: {
    width: "auto",
    paddingHorizontal: '5%',
    paddingVertical: '5%',
    marginTop: 10,
    marginHorizontal: 5,
    alignSelf: "center",
  },
  scrollContainer: {
    padding: 20,
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 30,
    elevation: 5,
    width: '90%',
    maxWidth: 550,
    height: 'auto',
    alignSelf: 'center',
  },
  ThemedText: {
    fontSize: 28,
    fontFamily: GlobalStyles.font,
    textAlign: "center",
    color: GlobalStyles.darkGrey,
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 20,
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  optionTitle: {
    fontSize: 22,
    marginBottom: 8,
    fontWeight: "bold",
    color: GlobalStyles.blue,
  },
  optionDescription: {
    fontFamily: GlobalStyles.font,
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
    fontSize: 16,
    marginLeft: 10,
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
    borderRadius: 15,
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
  registerText: {
    marginTop: 30,
    color: GlobalStyles.darkGrey,
    fontFamily: GlobalStyles.font,
    fontSize: 14,
    textAlign: 'center',
  },
  loginLink: {
    color: GlobalStyles.blue,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default withAuth(RegisterScreen, [AUTHORITIES.ANONYMOUS]);
