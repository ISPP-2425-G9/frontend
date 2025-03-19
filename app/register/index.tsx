import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import TextInputArraysForm from "@/components/TextInputArraysForm";
import { GlobalStyles } from "@/constants/Colors";
import { InputField } from "@/components/TextInputArraysForm";
import { BACKEND_API } from "@/constants/Mysc";
import { withAuth } from "../_util/withAuth";
import { AUTHORITIES } from "../_util/Authorities";
import { parseErrors } from "../_util/utils";
import { useAuth } from "../_util/useAuth";
import CustomButton from "@/components/CustomButton";

const { width } = Dimensions.get("window");

const RegisterScreen: React.FC = () => {
  const [userType, setUserType] = useState<"Empresa" | "Cliente" | null>(null);
  const navigation = useNavigation();
  const { login } = useAuth();

  // Company fields for the form
  const companyFields: InputField[] = [
    {
      name: "name",
      placeholder: "Floristería Loli S.L.",
      description: "Nombre de la empresa",
    },
    { name: "nif", placeholder: "F12345678", description: "NIF de la empresa" },
    {
      name: "zipCode",
      placeholder: "41001",
      description: "Código postal",
      keyboardType: "numeric",
    },
    {
      name: "telephone",
      placeholder: "600000000",
      keyboardType: "phone-pad",
      description: "Teléfono",
    },
    {
      name: "city",
      placeholder: "Sevilla",
      description: "Ciudad",
    },
    {
      name: "address",
      placeholder: "C/ Arquímedes, 3",
      description: "Dirección",
    },
    {
      name: "description",
      placeholder: "Descripción de la empresa...",
      description: "Descripción",
    },
    {
      name: "email",
      placeholder: "floresloli@gmail.com",
      keyboardType: "email-address",
      description: "Email",
    },
    {
      name: "password1",
      placeholder: "****",
      secureTextEntry: true,
      description: "Contraseña",
    },
    {
      name: "password2",
      placeholder: "****",
      secureTextEntry: true,
      description: "Confirmar contraseña",
    },
  ];

  // Customer fields for the form
  const clientFields: InputField[] = [
    {
      name: "name",
      placeholder: "Jesús García",
      description: "Nombre completo",
    },
    { name: "dni", placeholder: "12345678P", description: "DNI" },
    {
      name: "telephone",
      placeholder: "600000000",
      keyboardType: "phone-pad",
      description: "Teléfono",
    },
    {
      name: "email",
      placeholder: "jesusgar@gmail.com",
      keyboardType: "email-address",
      description: "Email",
    },
    {
      name: "password1",
      placeholder: "****",
      secureTextEntry: true,
      description: "Contraseña",
    },
    {
      name: "password2",
      placeholder: "****",
      secureTextEntry: true,
      description: "Confirmar contraseña",
    },
  ];

  const handleUserTypeSelection = (type: "Empresa" | "Cliente") => {
    setUserType(type);
  };

  const handleGoBack = () => {
    setUserType(null);
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

      if (
        !values.address ||
        typeof values.address !== "string" ||
        values.address.trim() === ""
      ) {
        errors.push("La dirección es obligatoria.");
      }

      if (
        !values.description ||
        typeof values.description !== "string" ||
        values.description.trim() === ""
      ) {
        errors.push("La descripción es obligatoria.");
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

    if (
      !values.telephone ||
      typeof values.telephone !== "string" ||
      !phoneRegex.test(values.telephone)
    ) {
      errors.push("Por favor, introduce un teléfono válido.");
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

    if (values.password1 !== values.password2) {
      errors.push("Las contraseñas no coinciden.");
    }

    return errors;
  };

  const handleSubmit = async (
    values: Record<string, string | { uri: string; name: string; type: string }>
  ) => {
    try {
      const errors: String[] = await validateData(values, userType);
      if (errors.length != 0) {
        throw new Error(`Hay error(es) en su formulario: ${errors}`);
      }
      const reqUrl =
        userType == "Empresa"
          ? "api/auth/companies/signup"
          : "api/auth/customers/signup";
      const response = await fetch(BACKEND_API + `/${reqUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errors = await response.json();
        const errorList = parseErrors(errors);
        throw new Error(`Hubo un problema al registrarse: \n ${errorList}`);
      }

      const data = await response.json();
      await AsyncStorage.setItem("authToken", data.token);
      await AsyncStorage.setItem("userId", data.id);
      await AsyncStorage.setItem("email", data.username);
      await AsyncStorage.setItem("roles", JSON.stringify(data.roles));
      await AsyncStorage.setItem("authToken", data.token);
      login(data.id, data.token, data.roles);
      navigation.navigate("home" as never);
    } catch (error: any) {
      if (Platform.OS === "web") {
        window.alert("Error: " + error);
      } else {
        Alert.alert("Error", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {!userType ? (
        <View style={styles.selectionContainer}>
          <Text style={styles.title}>Registro de Usuario</Text>
          <Text style={styles.subtitle}>Selecciona el tipo de cuenta:</Text>

          <CustomButton
            title="Registrarme como Cliente"
            onPress={() => handleUserTypeSelection("Cliente")}
            color="blue"
            style={styles.typeButton}
          />

          <CustomButton
            title="Registrar mi Empresa"
            onPress={() => handleUserTypeSelection("Empresa")}
            color="blue"
            style={styles.typeButton}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <CustomButton
            title="Volver"
            onPress={handleGoBack}
            color="grey"
            style={styles.backButton}
          />

          <TextInputArraysForm
            title={
              userType === "Empresa"
                ? "Registro de Empresa"
                : "Registro de Cliente"
            }
            inputs={userType === "Empresa" ? companyFields : clientFields}
            onSubmit={handleSubmit}
            buttonText="Completar Registro"
            style={styles.formStyle}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.white,
    padding: 20,
    paddingTop: 100,
  },
  selectionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  typeButton: {
    width: "80%",
    marginVertical: 15,
    height: 50,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formStyle: {
    backgroundColor: GlobalStyles.lightGrey,
    borderRadius: 15,
    padding: 20,
    width: "100%",
  },
  backButton: {
    width: 100,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
});

export default withAuth(RegisterScreen, [AUTHORITIES.ANONYMOUS]);
