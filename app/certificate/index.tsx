import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { useNavigation, NavigationProp, useRoute, RouteProp } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import { AUTHORITIES } from "../_util/Authorities";
import { withAuth } from "../_util/withAuth";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "@/components/CustomButton";
import { CustomTextInput } from "@/components/CustomTextInput";
import { GlobalStyles } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import CustomModal from "@/components/CustomModal";
import { BACKEND_API } from "@/constants/Mysc";

type RootStackParamList = {
    "obituaries/loadCertificate": { jsonData: string };
};

const { width } = Dimensions.get("window");

function LoadCertificate() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [formData, setFormData] = useState({
        dni: "",
        certificateImage: "",
    });

    const [dni, setDni] = useState<string>("");
    const [certificateImage, setCertificateImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);  
    const [dniError, setDniError] = useState<string>("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

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
        console.log("DNI:");
        if (!dni || !certificateImage) {
            alert("Por favor, introduce el DNI y selecciona un archivo.");
            return;
        }
        if (!validateDni(dni)) {
            setDni("");
            setDniError("El DNI no es válido. Debe tener el formato 12345678A.");
            return;
        }
        setModalMessage("La esquela no será enviada hasta que un administrador del sistema verifique que el certificado sea válido, podrá modificar su esquela hasta que se enviado a todos los contactos que usted eligio.")
        setModalVisible(true);
      };

      const handleCloseModal = () => {
        setModalVisible(false);
      };


      const handleSubmit = async () => {
        const authToken = await AsyncStorage.getItem("authToken");
    
        const base64File = certificateImage ? await convertToBase64(certificateImage) : "";
    
        const dataToSend = {
            dni,
            file: base64File, 
        };
    
        try {
            const response = await fetch(BACKEND_API + '/api/deathCertificate/upload', {
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
    
            const result = await response.json();
            console.log("Respuesta del servidor:", result);
    
            navigation.navigate("obituaries/loadCertificate", { 
                jsonData: JSON.stringify(result) 
            });
    
        } catch (error) {
            console.error("Error al enviar datos:", error);
    
            const errorMessage = (error as Error).message || "Hubo un problema al enviar los datos. Inténtalo de nuevo.";
            alert(errorMessage);
        }
    };
    
    


    return  (
        <View style={styles.container}>
            <View style={styles.dataContainer}>
            <Text style={styles.title}>Carga el certificado de defunción</Text>
            
            <Text>DNI:</Text>
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
    fontSize: 22,
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
    fontSize: 12,
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

export default withAuth(LoadCertificate, [AUTHORITIES.CUSTOMER, AUTHORITIES.ANONYMOUS]);
