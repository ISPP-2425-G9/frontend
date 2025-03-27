import CustomButton from "@/components/CustomButton";
import CustomModal from "@/components/CustomModal";
import { CustomTextInput } from "@/components/CustomTextInput";
import { GlobalStyles } from "@/constants/Colors";
import { BACKEND_API } from "@/constants/Mysc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AUTHORITIES } from "../_util/Authorities";
import { withAuth } from "../_util/withAuth";

type RootStackParamList = {
  "obituaries/loadCertificate": { jsonData: string },
  "home": undefined,
};

const { width } = Dimensions.get("window");

function LoadCertificate() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [dni, setDni] = useState<string>("");
  const [certificateImage, setCertificateImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dniError, setDniError] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      const fileName = result.assets[0].fileName || null;
      setCertificateImage(fileUri);
      setFileName(fileName);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setDni("");
      setCertificateImage(null);
      setFileName(null);
      setDniError("");
      document.title = 'Cargar certificado';
    }, [])
  );

  const convertToBase64 = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const validateDni = (dni: string) => {
    const dniRegex = /^\d{8}[A-Z]$/;
    return dniRegex.test(dni);
  };

  const showConfirmationModal = async () => {
    if (!dni || !certificateImage) {
      alert("Por favor, introduce el DNI y selecciona un archivo.");
      return;
    }
    if (!validateDni(dni)) {
      setDni("");
      setDniError("El DNI no es válido. Debe tener el formato 12345678A.");
      return;
    }
    setModalMessage("La esquela no será enviada hasta que un administrador del sistema verifique que el certificado sea válido. Podrá modificar su esquela hasta que sea enviada a todos los contactos que usted eligió.");
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    const base64File = certificateImage ? await convertToBase64(certificateImage) : "";
    const authToken = await AsyncStorage.getItem("authToken");
    const dataToSend = { dni, file: base64File };

    setModalVisible(false);

    try {
      const response = await sendDataToBackend(authToken, dataToSend);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Hubo un problema al enviar los datos. Inténtalo de nuevo.");
      }

    else{ 
      setSuccessMessageVisible(true);
      setTimeout(() => {
        setSuccessMessageVisible(false);  
        navigation.navigate("home");  
      }, 2000);

    }

    } catch (error) {
      console.error("Error al enviar datos:", error);
      setModalVisible(false);
      const errorMessage = (error as any).message || "Hubo un problema al enviar los datos. Inténtalo de nuevo.";
      alert(errorMessage);
    }
  };

  const sendDataToBackend = async (authToken: string | null, dataToSend: { dni: string; file: string; }) => {
    const url = authToken
      ? BACKEND_API + '/api/deathCertificate/upload/loggedInUser'
      : BACKEND_API + '/api/deathCertificate/upload';

    const headers = {
      "Content-Type": "application/json",
      ...(authToken && { "Authorization": `Bearer ${authToken}` }), 
    };

    return await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(dataToSend),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <Text style={styles.title}>Carga el certificado de defunción</Text>

        <Text style={styles.text}>DNI:</Text>
        <CustomTextInput
          placeholder={dniError ? dniError : "DNI del fallecido"}
          value={dni}
          maxLength={9}
          keyboardType="numeric"
          onChangeText={(value) => {
            let newValue = value.replace(/[^0-9A-Za-z]/g, "");

            if (newValue.length > 9) {
              newValue = newValue.slice(0, 9);
            }

            if (newValue.length <= 8) {
              newValue = newValue.replace(/[^0-9]/g, "");
            }

            if (newValue.length === 9) {
              const lastChar = newValue[8];
              if (!/[A-Za-z]/.test(lastChar)) {
                newValue = newValue.slice(0, 8);
              } else {
                newValue = newValue.slice(0, 8) + lastChar.toUpperCase();
              }
            }
            setDni(newValue);
            setDniError("");
          }}
          style={styles.input}
          placeholderTextColor={dniError ? "red" : GlobalStyles.darkGrey}
        />

        {certificateImage && (
          <Image
            source={{ uri: certificateImage }}
            style={styles.imagePreview}
          />
        )}

        {fileName && (
          <Text style={styles.fileNameText}>
            Archivo subido: {fileName}
          </Text>
        )}

      </View>
      <View style={styles.divider} />
      <View style={styles.buttonContainer}>
        <CustomButton title="Seleccionar archivo" onPress={pickImage} />
        <CustomButton title="Subir certificado" onPress={showConfirmationModal} />
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
              onPress={() => { handleSubmit(); }}
            >
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => { handleCloseModal(); }}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
      )}

      {successMessageVisible && (
        <CustomModal
          visible={successMessageVisible}
          onClose={() => {setSuccessMessageVisible(false)}}
          title="¡Datos enviados con éxito!✅"
          style={styles.successModal}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSuccessMessageVisible(false);
                navigation.navigate("home");
              }}
            >
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: GlobalStyles.white,
  },
  dataContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: '2%',
    width: "90%",
    maxWidth: 500,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: '1%',
    alignSelf: 'flex-start',
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    marginBottom: 16,
    fontSize: 16,
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
    width: '100%',
    gap: '2%',
  },
  fileNameText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  imagePreview: {
    width: "30%",
    height: "30%",
    marginTop: 10,
    resizeMode: "contain"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: GlobalStyles.blue,
    paddingHorizontal: 25,
    width: '13%',
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
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
    height: width > 600 ? "15%" : "32%",
  },
  successModal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: width > 600 ? '40%': '80%',
  },
});

export default withAuth(LoadCertificate, [AUTHORITIES.CUSTOMER, AUTHORITIES.ANONYMOUS]);
