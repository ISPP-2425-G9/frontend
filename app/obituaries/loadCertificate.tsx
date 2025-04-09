import CustomButton from "@/components/CustomButton";
import CustomModal from "@/components/CustomModal";
import { CustomTextInput } from "@/components/CustomTextInput";
import PaymentModalObituary from "@/components/PaymentModalObituary";
import { ThemedView } from "@/components/ThemedView";
import { GlobalStyles } from "@/constants/Colors";
import { BACKEND_API } from "@/constants/Mysc";
import { useNotification } from '@/context/NotificationContext';
import useAuth from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
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

  const { showNotification } = useNotification();

  const route = useRoute<ObituaryLoadCertificateRouteProp>();
  const { is_mine, is_newObituary } = route.params;


  const { isAuthenticated } = useAuth();
  const [dni, setDni] = useState<string>("");
  const [certificateImage, setCertificateImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dniError, setDniError] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Nuevos estados para el pago
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      mediaTypes: ['images', 'livePhotos', 'videos'],
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
    
    if (!is_mine) {
      setShowPaymentModal(true);
    } else {
      await handleSubmit();
    }
  };

  const handlePaymentSuccess = async (paymentMethod: { id: string }) => {
    setShowPaymentModal(false);
    await handleSubmit(paymentMethod.id);
    setShowSuccessModal(true);
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigation.navigate("obituaries/index");
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };


  const handleSubmit = async (paymentMethodId?: string) => {
    const authToken = await AsyncStorage.getItem("authToken");
    const jsonData = route.params.jsonData ?? '';
    const base64File = certificateImage ? await convertToBase64(certificateImage) : "";
    
    const dataToSend = {
      ...JSON.parse(jsonData),
      deathCertificate: {
        dni: dni,
        file: base64File
      },
      isMine: is_mine
    };

    try {
      const requestBody = {
        ...dataToSend
      };
      
      if (paymentMethodId) {
        requestBody.paymentMethodId = paymentMethodId;
      }
      
      
      const response = await fetch(BACKEND_API + '/api/obituary/create', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
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
      showNotification({
        message: `${errorMessage}`,
        type: "error",
        duration: 2500,
      });
    }
  };

  const content = isAuthenticated ? (
    <ScrollView style={{ flex: 1, width: "100%" }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>📜 Certificados de defunción 📜</Text>
          <Text style={styles.introText}>
            En esta sección, tiene que cargar el certificado de defunción de la persona fallecida.
          </Text>
          <Text style={styles.introText}>
            Este certificado será verificado por un <Text style={{fontWeight: "bold"}}>administrador</Text> del sistema para garantizar su autenticidad. (Puede tardar un tiempo)
          </Text>
          <Text style={styles.introText}>
            Una vez verificado, la esquela que ha creado será compartida con los contactos añadidos automáticamente.
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
          <CustomButton
            title={is_newObituary ? "Pagar esquela (1,99 €)" : "Actualizar esquela"}
            style={styles.certificateButton} textStyle={styles.certificateText}
            onPress={() => {
              if (is_newObituary) {
                void showConfirmationModal();
              } else {
                showNotification({
                  message: "Función todavía no implementada",
                  type: "info",
                  duration: 2500,
                });
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
                onPress={() => { handleSubmit(); }}
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
    </ScrollView>


  ) : (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Debes iniciar sesión para poder acceder a esta sección</Text>
    </ThemedView>
  );

  return (
    <>
      {content}
      <PaymentModalObituary
        visible={showPaymentModal}
        onClose={handlePaymentCancel}
        amount={1.99}
        description="Pago por la creación de una esquela digital"
        onSuccess={handlePaymentSuccess}
      />
    </>
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
    width: "100%",
    gap: "2%",
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
    marginBottom: 5,
  },
  certificateButton: {
    height: "90%",
    width : width > 600 ? "15%" : "45%",
  },
  certificateText: {
    fontSize: width > 600 ? 18 : 16,
  },
  dniStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  acceptedFormats: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    color: GlobalStyles.darkGrey,
    fontStyle: 'italic',
  },
});

export default withAuth(LoadCertificate, [AUTHORITIES.CUSTOMER]);

