import CustomButton from "@/components/CustomButton";
import CustomModal from "@/components/CustomModal";
import { CustomTextInput } from "@/components/CustomTextInput";
import { ThemedView } from "@/components/ThemedView";
import { GlobalStyles } from "@/constants/Colors";
import { BACKEND_API } from "@/constants/Mysc";
import useAuth from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AUTHORITIES } from "../_util/Authorities";
import { withAuth } from "../_util/withAuth";

type RootStackParamList = {
  "obituaries/loadCertificate": {
    jsonData: string
    is_newObituary: boolean,
    obituaryId: string,
    is_mine: boolean
  };
  "obituaries/index": undefined;
};

type ObituaryLoadCertificateRouteProp = RouteProp<
  RootStackParamList,
  "obituaries/loadCertificate"
>;

const { width } = Dimensions.get("window");

function LoadCertificate() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();


  const route = useRoute<ObituaryLoadCertificateRouteProp>();
  const is_newObituary = route.params?.is_newObituary;


  const { isAuthenticated } = useAuth();
  const [dni, setDni] = useState<string>("");
  const [certificateImage, setCertificateImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dniError, setDniError] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");


  const json = route.params?.jsonData;


  const is_mine = route.params?.is_mine;
  const [formData, setFormData] = useState({
    dni: "",
    certificateImage: "",
  });


  useEffect(() => {
    const initializeForm = async () => {
      if (is_newObituary === true) {
        setFormData({
          dni: "",
          certificateImage: "",
        });
        return;
      } else {
        const authToken = await AsyncStorage.getItem("authToken");
        const obituaryId = route.params?.obituaryId ?? "";
        console.log("obituaryId", obituaryId);
        if (!obituaryId) {
          console.error("Obituary ID es necesario y no está presente.");
          return;
        }
        const response = await fetch(`${BACKEND_API}/api/deathCertificate/obituary/${obituaryId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
        );

        console.log('Status Code:', response.status); // Verifica el código de estado
        console.log('Response:', await response.text()); // Verifica el contenido de la respuesta

        if (!response.ok) throw new Error("Error al obtener los datos");
        const data = await response.json();
        setDni(data.dni);
        setCertificateImage(data.deathCertificate.url);
      }
    };

    void initializeForm();
  }, [is_newObituary]);


  useFocusEffect(
    useCallback(() => {
      setDni("");
      setCertificateImage(null);
      setFileName(null);
      setDniError("");
    }, [])
  );


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      const fileName = result.assets[0].fileName || null;
      setFormData({ ...formData, certificateImage: fileUri });
      setCertificateImage(fileUri);
      setFileName(fileName);
    }
  };

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
      setDniError("El DNI debe tener el formato 12345678A.");
      return;
    }
    setModalMessage("La esquela no será enviada hasta que un administrador del sistema verifique que el certificado sea válido.")
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };


  const handleSubmit = async () => {

    const authToken = await AsyncStorage.getItem("authToken");
    const jsonData = route.params.jsonData ?? '';
    const base64File = certificateImage ? await convertToBase64(certificateImage) : "";
    console.log("adios", jsonData);
    const dataToSend = {
      ...JSON.parse(jsonData),
      deathCertificate: {
        dni: dni,
        file: base64File
      },
      isMine: is_mine
    };

    try {
      const response = await fetch(BACKEND_API + '/api/obituary/create', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Hubo un problema al enviar los datos. Inténtalo de nuevo.");
      }
      setModalVisible(false);
      navigation.navigate("obituaries/index");


    } catch (error) {
      console.error("Error al enviar datos:", error);
      const errorMessage = (error as Error).message || "Hubo un problema al enviar los datos. Inténtalo de nuevo.";
      alert(errorMessage);
    }
  };

  return isAuthenticated ? (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <Text style={styles.title}>Carga el certificado de defunción</Text>

        <Text style={{ textAlign: 'left' }}>DNI:</Text>
        <CustomTextInput
          placeholder={dniError ? dniError : "Dni del fallecido"}
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
        <CustomButton
          title={is_newObituary ? "Pagar esquela (1,99 €)" : "Actualizar esquela"}
          onPress={() => {
            if (is_newObituary) {
              void showConfirmationModal();
            } else {
              window.alert("Función todavía no implementada");
            }
          }}
        />
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
              onPress={() => {handleSubmit(); }}
            >
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => { handleCloseModal() }}
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
    padding: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#ffff",
  },
  dataContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 120,
  },
  infoText: {
    fontSize: 14,
    color: GlobalStyles.white,
    textAlign: "center",
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
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
    width: "35%",
    gap: "2%",
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
  errorText: {
    fontSize: 8,
    color: "red",
    marginTop: 5,
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
});

export default withAuth(LoadCertificate, [AUTHORITIES.CUSTOMER]);

