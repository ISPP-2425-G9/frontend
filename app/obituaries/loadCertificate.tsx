import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { useNavigation, NavigationProp, useRoute, RouteProp } from "@react-navigation/native";
import { AUTHORITIES } from "../_util/Authorities";
import { withAuth } from "../_util/withAuth";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "@/components/CustomButton";
import { CustomTextInput } from "@/components/CustomTextInput";
import { GlobalStyles } from "@/constants/Colors";

type RootStackParamList = {
    "obituaries/loadCertificate": { jsonData: string };
};

function LoadCertificate() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "obituaries/loadCertificate">>();
    const [formData, setFormData] = useState({
        dni: "",
        certificateImage: "",
    });

    const [dni, setDni] = useState<string>("");
    const [certificateImage, setCertificateImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);  
    const [dniError, setDniError] = useState<string>("");

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

    const handleSubmit = async () => {
        const authToken = await AsyncStorage.getItem("authToken");
        console.log(dni);

        if (!dni || !certificateImage) {
            alert("Por favor, introduce el DNI y selecciona un archivo.");
            return;
        }
        if (!validateDni(dni)) {
            setDni("");
            setDniError("El DNI no es válido. Debe tener el formato 12345678A.");
            console.log(dniError);
            return;
        }
        const base64File = await convertToBase64(certificateImage);

        const dataToSend = {
            dni,
            file: base64File, 
        };

        try {
            const response = await fetch("http://aa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(dataToSend), 
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Respuesta del servidor:", result);

            navigation.navigate("obituaries/loadCertificate", { 
                jsonData: JSON.stringify(result) 
            });

        } catch (error) {
            console.error("Error al enviar datos:", error);
            alert("Hubo un problema al enviar los datos. Inténtalo de nuevo.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.dataContainer}>
            <Text style={styles.title}>Carga el certificado de defunción</Text>
            
            <Text>DNI:</Text>
            <CustomTextInput
                placeholder={dniError ? dniError : "Dni del fallecido"} 
                value={dni} 
                maxLength={9}
                keyboardType="phone-pad"
                onChangeText={(value) => {
                    setDni(value);
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
            <CustomButton title="Seleccionar Archivo" onPress={pickImage} />
            <CustomButton title="Pagar esquela (1,99 €)" onPress={handleSubmit} />
        </View>
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
  info: {
    width: "40%",
    borderColor: GlobalStyles.blue,
    marginTop: 20,  
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: GlobalStyles.blue,
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
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreview: {
    width: "30%",
    height: "30%",
    marginTop: 10,
    resizeMode: "contain"
  },
  errorText: {
    fontSize: 14,
    color: "red",  
    marginTop: 5,
  }
});

export default withAuth(LoadCertificate, [AUTHORITIES.CUSTOMER]);
