import CustomButton from "@/components/CustomButton";
import CustomModal from "@/components/CustomModal";
import { CustomTextInput } from "@/components/CustomTextInput";
import { GlobalStyles } from "@/constants/Colors";
import { BACKEND_API } from "@/constants/Mysc";
import { useNotification } from '@/context/NotificationContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type RootStackParamList = {
  "obituaries/loadCertificate": { jsonData: string },
  "home": undefined,
};

const { width } = Dimensions.get("window");

function LoadCertificate() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { showNotification } = useNotification();

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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const allowedFormats = ["png", "jpg", "jpeg"];
      const filteredAssets = result.assets.filter(asset => {
        const fileExtension = asset.mimeType ? asset.mimeType.split("/")[1] : '';
        return allowedFormats.includes(fileExtension);
      });

      if (filteredAssets.length === 0) {
        showNotification({
          message: "Solo se permiten imágenes en formato PNG, JPG o JPEG.",
          type: "info",
          duration: 2500,
        });
        return;
      }
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
      document.title = 'Subir certificado';
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
    if (!dniRegex.test(dni)){
      return false
    }
    const dniNumber = dni.slice(0, 8);
    const dniLetter = dni.charAt(8);
    const dniLetters = "TRWAGMYFPDXBNJZSQVHLCKE";
    const dniIndex = parseInt(dniNumber, 10) % 23;
    const expectedLetter = dniLetters.charAt(dniIndex);
    return dniLetter === expectedLetter;
  };

  const showConfirmationModal = async () => {
    if (!dni || !certificateImage) {
      showNotification({
        message: "Por favor, introduce el DNI y selecciona un archivo.",
        type: "info",
        duration: 2500,
      });
      return;
    }
    if (!validateDni(dni)) {
      setDni("");
      showNotification({
        message: "El DNI no es válido. Debe tener el formato 12345678A.",
        type: "error",
      });
      return;
    }
    setModalMessage("Una vez subido el certificado de defunción un administrador lo revisará. Si todo es correcto, se enviarán las esquelas y/o mensajes asociados al certificado. ¿Estás seguro de que quieres continuar?");
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

      else {
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
      showNotification({
        message: `${errorMessage}`,
        type: "info",
        duration: 2500,
      });
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
    <ScrollView style={{ flex: 1, width: "100%" }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
      <View style={styles.container}>

        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>📜 Certificados de defunción 📜</Text>
          <Text style={styles.introText}>
            En esta sección, puedes cargar el certificado de defunción de un ser querido que haya contratado nuestros servicios.
          </Text>
          <Text style={styles.introText}>
            Una vez verificado, las esquelas y/o mensajes previamente creados serán enviados a los contactos seleccionados.
          </Text>
          <Text style={styles.introText}>
            Para ello necesitamos que introduzcas el DNI del fallecido y subas el certificado de defunción.
          </Text>
        </View>
        <View style={styles.dataContainer}>

          <Text style={styles.text}>DNI:</Text>
          <CustomTextInput
            placeholder={dniError ? dniError : "DNI del fallecido"}
            value={dni}
            maxLength={9}
            keyboardType="default"
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

          {fileName ? (
            <Text style={styles.fileNameText}>
              Archivo subido: {fileName}
            </Text>
          ) : (
            <Text style={styles.acceptedFormats}>
              Formatos aceptados: PNG, JPG, JPEG
            </Text>
          )}

        </View>
        <View style={styles.buttonContainer}>
          <CustomButton title="Seleccionar archivo" style={styles.certificateButton} textStyle={styles.certificateText} onPress={pickImage} />
          <CustomButton title="Subir certificado de defunción" style={styles.certificateButton} textStyle={styles.certificateText} onPress={showConfirmationModal} />
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
            onClose={() => { setSuccessMessageVisible(false) }}
            title="¡Certificado de defunción subido con éxito!✅"
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
    </ScrollView>
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
    alignItems: "stretch",
    width: "90%",
    maxWidth: 500,
    padding: 20,
    gap: 10,
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
    width: '100%',
    flex: 1,

  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1%",
    flexDirection: "row",
    width: '100%',
    gap: '2%',
    marginTop: 20,
  },
  fileNameText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  imagePreview: {
    alignContent: "center",
    alignSelf: "center",
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
    width: width > 600 ? '20%'  :'30%',
    height: width > 600 ? 40 : '120%',
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
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
    minHeight: 200,
    justifyContent: "space-between",
  },
  successModal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: width > 600 ? '40%' : '80%',
  },
  introContainer: {
    width: '90%',
    backgroundColor: GlobalStyles.lightGrey,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: GlobalStyles.darkGrey,
    marginBottom: 10,
    textAlign: 'center',
  },
  introText: {
    fontSize: 20,
    color: GlobalStyles.darkGrey,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 3,
  },
  acceptedFormats: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    color: GlobalStyles.darkGrey,
    fontStyle: 'italic',
  },
  certificateButton: {
    height: "80%",
    width: width > 600 ? "15%" : "45%"
  },
  certificateText: {
    fontSize: width > 600 ? 18 : 16,
  },
  dniStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default LoadCertificate;
