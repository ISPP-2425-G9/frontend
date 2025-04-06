import React from 'react';
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
import { useNotification } from '@/context/NotificationContext';
import { ScrollView } from "react-native-gesture-handler";
import PaymentModalObituary from "@/components/PaymentModalObituary";

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
  const is_newObituary = route.params?.is_newObituary;


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
  const [isProcessing, setIsProcessing] = useState(false);

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
    return dniRegex.test(dni);
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
      setDniError("El DNI debe tener el formato 12345678A.");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    await handleSubmit();
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
            Este certificado será verificado por un administrador del sistema para garantizar su autenticidad.
          </Text>
          <Text style={styles.introText}>
            Una vez verificado, la esquela será enviada a los familiares y amigos seleccionados.
          </Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.title}>Datos del fallecido</Text>

          <Text style={{ textAlign: 'left' }}>DNI:</Text>
          <CustomTextInput
            placeholder={dniError ? dniError : "Dni del fallecido"}
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
    padding: 30,
  },
  infoText: {
    fontSize: 10,
    color: GlobalStyles.white,
    textAlign: "center",
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 26,
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
    width: "100%",
    gap: "2%",
    marginTop: 20,
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
    fontSize: 30,
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
    color: GlobalStyles.darkGrey,
    fontStyle: 'italic',
  },

});

export default withAuth(LoadCertificate, [AUTHORITIES.CUSTOMER]);

