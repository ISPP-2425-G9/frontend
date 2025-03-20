import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Alert,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "@/components/CustomButton";
import { CustomTextInput } from "@/components/CustomTextInput";
import {
  useNavigation,
  NavigationProp,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import CustomModal from "@/components/CustomModal";
import { GlobalStyles } from "@/constants/Colors";
import { BACKEND_API } from "@/constants/Mysc";
import { withAuth } from "../_util/withAuth";
import { AUTHORITIES } from "../_util/Authorities";
import { RFValue, } from "react-native-responsive-fontsize";
import useAuth from "@/hooks/useAuth";
import { ThemedView } from "@/components/ThemedView";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

type RootStackParamList = {
  "obituaries/selectContacts": {
    jsonData: string,
    is_newObituary: boolean,
    obituaryId: number,
    is_mine: boolean | undefined, 
    isMine: boolean | undefined
  };
  "obituaries/createObituary": {
    imageTemplateId: number,
    imageUrl: string,
    is_newObituary: boolean,
    obituaryId: number,
    jsonData: string,
    is_mine: boolean;
  };
  "obituaries/index": {
    is_newObituary: boolean,
    obituaryId: number,
    jsonData: string,
    changeDesign: boolean,
    is_mine: boolean
  };
};

function EsquelaCustomizer() {

  
  const [selectedColor, setSelectedColor] = useState(""); 

  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  const { isAuthenticated } = useAuth();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, "obituaries/createObituary">>();

  const is_newObituary = route.params?.is_newObituary ?? true;

  const obituaryId = route.params?.obituaryId ?? undefined;

  const imageId = route.params?.imageTemplateId;

  const imageUrl = route.params?.imageUrl;

  const [modalVisible, setModalVisible] = useState(false);

  const [modalMessage, setModalMessage] = useState("");

  const [loading, setLoading] = useState(true);

  const jsonData = route.params?.jsonData ?? undefined;

  const is_mine = route.params?.is_mine;

  const [ isMine, setIsMine] = useState();

  const [is_sended, setIsSended] = useState();

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setColorPickerVisible(false);
  };


  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    deathDate: "",
    farewellMessage: "",
    farewellPhrase: "",
    imageTemplate_id: imageId,
    customImage: null as string | null,
  });

  useEffect(() => {
    const initializeForm = async () => {
      setLoading(true);
      setSelectedColor("")

      if (jsonData !== undefined) {
        console.log("jsonData", jsonData);
        try {
          const parsedData = JSON.parse(jsonData);
          setFormData((prev) => ({
            ...prev,
            ...parsedData,
          }));
        } catch (error) {
          console.error("Error al parsear jsonData:", error);
        } finally {
          setLoading(false);
        }
        return;
      }

      if (is_newObituary) {
        console.log("imageId", imageId);
        setFormData({
          name: "",
          birthDate: "",
          deathDate: "",
          farewellMessage: "",
          farewellPhrase: "",
          customImage: null,
          imageTemplate_id: imageId || 1,
        });
        setLoading(false);
        return;
      }

      if (!is_newObituary && obituaryId !== undefined) {
        try {
          const authToken = await AsyncStorage.getItem("authToken");
          if (!authToken)
            throw new Error("No se encontró un token de autenticación");

          const response = await fetch(
            `${BACKEND_API}/api/obituary/myObituaries/${obituaryId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken.trim()}`,
              },
            }
          );

          if (!response.ok) throw new Error("Error al obtener los datos");
          const data = await response.json();

          let formatBirthDate = "";
          if (data.birthDate) {
            const [year, month, day] = data.birthDate.split("-") || [];
            if (day && month && year) {
              formatBirthDate = `${day}/${month}/${year}`;
            }
          }

          setSelectedColor(`rgb(${data.wordColor})`);
          console.log("data", selectedColor);  
          setIsMine(data.isMine)
          setIsSended(data.deathDate)

          setFormData({
            name: data.name || "",
            birthDate: formatBirthDate || "",
            deathDate: data.deathDate || "",
            farewellMessage: data.farewellMessage || "",
            farewellPhrase: data.farewellPhrase || "",
            customImage: data.customImageUrl || null,
            imageTemplate_id: imageId || 1,
          });
       
        } catch (error) {
          console.error("Error al cargar la esquela:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    initializeForm();
  }, [is_newObituary, obituaryId, imageId]);

  useEffect(() => {
    return () => {
      setFormData({
        name: "",
        birthDate: "",
        deathDate: "",
        farewellMessage: "",
        farewellPhrase: "",
        customImage: null,
        imageTemplate_id: imageId || 1,
      });
    };
  }, []);

  const changeDesign = async () => {
    const obituaryId = route.params?.obituaryId ?? undefined;
    const jsonData = JSON.stringify(formData, null, 2);

    navigation.navigate("obituaries/index" as never, {
      is_newObituary,
      obituaryId,
      jsonData,
      changeDesign: true,
      is_mine
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, customImage: result.assets[0].uri });
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleCloseModalColors = () => {
    setColorPickerVisible(false);
  };


  const validateForm = () => {
    const { name, birthDate, farewellMessage, farewellPhrase, customImage } =
      formData;
    const errors: string[] = [];

    const birthDatePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (birthDate && !birthDate.match(birthDatePattern)) {
      errors.push(
        "El formato de la fecha de nacimiento es incorrecto. Debe ser dd/mm/aaaa"
      );
      return errors;
    }

    if (!name || !birthDate || !farewellMessage || !farewellPhrase) {
      if (customImage === null) {
        setModalMessage(
          "No has seleccionado una imagen y hay datos sin completar. ¿Desea continuar?"
        );
      } else {
        setModalMessage("Hay datos sin completar. ¿Desea continuar?");
      }
    } else if (customImage === null) {
      setModalMessage("No has seleccionado una imagen. ¿Desea continuar?");
    } else {
      setModalMessage("¿Desea continuar?");
    }
    setModalVisible(true);

    return errors;
  };

  const showConfirmationModal = () => {
    try {
      const errors = validateForm();
      if (errors.length != 0) {
        throw new Error(`Hay error(es) en su formulario: ${errors}`);
      }
    } catch (error: any) {
      if (Platform.OS === "web") {
        window.alert("Error: " + error);
      } else {
        Alert.alert("Error", error);
      }
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const jsonData = JSON.stringify(formData, null, 2);
      const parsedJsonData = JSON.parse(jsonData);
  
      const rgbMatch = selectedColor.match(/\d+/g);
      const rgbString = rgbMatch ? rgbMatch.join(",") : "0,0,0";  
  
      parsedJsonData.wordColor = rgbString;
  
      const finalJsonData = JSON.stringify(parsedJsonData, null, 2);
  
      navigation.navigate("obituaries/selectContacts" as never, {
        jsonData: finalJsonData,
        is_newObituary,
        obituaryId,
        is_mine, 
        isMine
      });
    }
    setModalVisible(false);
  };

  return isAuthenticated ? (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.formSection}>
          <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 30 }}>
            { is_mine ?
              is_newObituary ? "Cree su esquela" : "Edite su esquela" :
              is_newObituary ? "Cree la esquela para un ser querido" : "Edite la esquela para un ser querido"
            }
          </Text>
          <Text style={styles.formText}>Nombre del fallecido:</Text>
          <CustomTextInput
            style={{ width: "75%" }}
            placeholder="Nombre"
            maxLength={37}
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
          />

          <Text style={styles.formText}>Fecha de nacimiento:</Text>
          <CustomTextInput
            style={{ width: "75%" }}
            placeholder="dd/mm/aaaa"
            value={formData.birthDate}
            maxLength={10}
            keyboardType="numeric"
            onChangeText={(text) => {
              let cleaned = text.replace(/\D/g, "");
              let day = "";
              let month = "";
              let year = "";
              if (cleaned.length >= 1) day = cleaned.slice(0, 2);
              if (cleaned.length >= 3) month = cleaned.slice(2, 4);
              if (cleaned.length >= 5) year = cleaned.slice(4, 8);

              if (day.length === 2) {
                let dayNum = parseInt(day, 10);
                if (dayNum > 31) day = "31";
                else if (dayNum < 1) day = "01";
                else day = dayNum.toString().padStart(2, "0");
              }
              if (month.length === 2) {
                let monthNum = parseInt(month, 10);
                if (monthNum > 12) month = "12";
                else if (monthNum < 1) month = "01";
                else month = monthNum.toString().padStart(2, "0");
              }
              if (year.length === 4) {
                let yearNum = parseInt(year, 10);
                if (yearNum < 1800) year = "1800";
                else if (yearNum > 2025) year = "2025";
                else year = yearNum.toString();
              }

              let formatted = day;
              if (month) formatted += "/" + month;
              if (year) formatted += "/" + year;
              if (formatted.length > 10) formatted = formatted.slice(0, 10);

              const currentDate = new Date();
              const inputDate = new Date(`${year}-${month}-${day}`);

              if (inputDate > currentDate) {
                formatted = `${currentDate.getDate().toString().padStart(2, "0")}/${(currentDate.getMonth() + 1).toString().padStart(2, "0")}/${currentDate.getFullYear()}`;
              }

              handleChange("birthDate", formatted);
            }}
          />

          <Text style={styles.formText}>Fecha de fallecimiento:</Text>
          <CustomTextInput
            style={{ width: "75%" }}
            placeholder={is_mine ? "La fecha de fallecimiento (se añadirá automáticamente)" : "Fecha de fallecimiento"}
            value={formData.deathDate}
            maxLength={12}
            editable={!is_mine ? true : false}
            onChangeText={(text) => {
              let cleaned = text.replace(/\D/g, "");
              let day = "";
              let month = "";
              let year = "";
              if (cleaned.length >= 1) day = cleaned.slice(0, 2);
              if (cleaned.length >= 3) month = cleaned.slice(2, 4);
              if (cleaned.length >= 5) year = cleaned.slice(4, 8);
              if (day.length === 2) {
                let dayNum = parseInt(day, 10);
                if (dayNum > 31) day = "31";
                else if (dayNum < 1) day = "01";
                else day = dayNum.toString().padStart(2, "0");
              }
              if (month.length === 2) {
                let monthNum = parseInt(month, 10);
                if (monthNum > 12) month = "12";
                else if (monthNum < 1) month = "01";
                else month = monthNum.toString().padStart(2, "0");
              }
              if (year.length === 4) {
                let yearNum = parseInt(year, 10);
                if (yearNum < 1800) year = "1800";
                else if (yearNum > 2025) year = "2025";
                else year = yearNum.toString();
              }
              let formatted = day;
              if (month) formatted += "/" + month;
              if (year) formatted += "/" + year;
              if (formatted.length > 10) formatted = formatted.slice(0, 10);

              const currentDate = new Date();
              const inputDate = new Date(`${year}-${month}-${day}`);

              if (inputDate > currentDate) {
                formatted = `${currentDate.getDate().toString().padStart(2, "0")}/${(currentDate.getMonth() + 1).toString().padStart(2, "0")}/${currentDate.getFullYear()}`;
              }

              handleChange("deathDate", formatted);
            }}
            keyboardType="numeric"
          />

          <Text style={styles.formText}>Mensaje de despedida:</Text>
          <CustomTextInput
            style={[{ width: "75%" }]}
            placeholder="Escribe un mensaje de despedida"
            value={formData.farewellMessage}
            maxLength={624}
            //multiline
            onChangeText={(text) => handleChange("farewellMessage", text)}
          />

          <Text style={styles.formText}>Frase de despedida:</Text>
          <CustomTextInput
            style={{ width: "75%" }}
            placeholder="Frase de despedida"
            maxLength={90}
            value={formData.farewellPhrase}
            onChangeText={(text) => handleChange("farewellPhrase", text)}
          />

          {!is_sended && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  gap: 8,
                  width: "75%",
                }}
              >
                <CustomButton
                  style={styles.customButtonStyle}
                  title="Selecciona una imagen"
                  onPress={pickImage}
                />
                <CustomButton
                  style={styles.customButtonStyle}
                  title="Selecciona un color de texto"
                  onPress={() => setColorPickerVisible(true)}
                />
                <CustomButton
                  style={styles.customButtonStyle}
                  title="Cambia el diseño de tu esquela"
                  onPress={changeDesign}
                />

              </View>
              <CustomButton
                color="grey"
                style={{ marginTop: 12, width: "75%" }}
                title={is_newObituary ? "Seleccionar contactos" : "Actualice sus contactos"}
                onPress={showConfirmationModal}
              />
            </>
          )}
        </View>

        <View style={styles.previewSection}>
          <View style={styles.overlayContainer}>
            <Image source={{ uri: imageUrl }} style={styles.templateImage} />
            <View style={styles.overlayContent}>
              <Image
                source={
                  formData.customImage
                    ? { uri: formData.customImage }
                    : require("@/assets/images/default-dark-image.jpg")
                }
                style={styles.customImage}
              />
              <Text style={[styles.previewName, { color: selectedColor }]}>
                {formData.name || "Nombre "}
              </Text>
              <Text style={[styles.previewDate, { color: selectedColor }]}>
                {formData.birthDate || "Año de nacimiento"} -{" "}
                {formData.deathDate || "Año de fallecimiento"}
              </Text>
              <Text style={[styles.previewText, { color: selectedColor }]}>
                {formData.farewellMessage ||
                  "Tu mensaje de despedida aparecerá aquí"}
              </Text>
              <Text style={[styles.previewPhrase, { color: selectedColor }]}>
                "{formData.farewellPhrase || "Frase de despedida"}"
              </Text>
            </View>
          </View>
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
        {colorPickerVisible && (<CustomModal
          visible={colorPickerVisible}
          onClose={handleCloseModalColors}
          style={styles.modalStyle}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Selecciona un color</Text>
            <View style={styles.gradient}>
              {Array.from({ length: 10 }).map((_, index) => {
                const color = [
                  "rgb(253, 111, 111)", "rgb(209, 181, 129)", "rgb(195, 221, 255)", "rgb(190, 177, 161)", "rgb(60, 179, 113)",
                  "rgb(255, 255, 255)", "rgb(150, 150, 150)", "rgb(100, 100, 100)", "rgb(33, 33, 33)", "rgb(0,0,0)"
                ][index];
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.colorBox, { backgroundColor: color }]}
                    onPress={() => handleColorSelect(color)}
                  />
                );
              })}
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setColorPickerVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>)}
      </View>
    </ScrollView>
  ) : (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Debes iniciar sesión para poder acceder a esta sección</Text>
    </ThemedView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: width > 600 ? "row" : "column",
    paddingTop: 105,
  },
  formSection: {
    flex: 1,
    paddingLeft: width > 600 ? 80 : 0,
    alignItems: width > 600 ? "flex-start" : "center",
    width: "100%",
    gap: "1%",
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
  previewSection: {
    flex: 1,
    position: "relative",
  },
  previewText: {
    fontSize: width > 600 ? RFValue(6) : RFValue(8.5),
    maxWidth: width > 600 ? 400 : "80%",
    marginTop: 8,
    textAlign: "justify",
  },
  previewName: {
    fontSize: width > 600 ? 20 : 16,
    fontWeight: "bold",
    marginTop: 8,
    maxWidth: 400,
  },
  previewDate: {
    fontSize: width > 600 ? 18 : 14,
    marginBottom: 8,
    maxWidth: 400,
    marginTop: 8,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1%",
    flexDirection: "row",
    width: "35%",
    gap: "2%",
  },
  previewPhrase: {
    marginTop: 15,
    fontSize: width > 600 ? RFValue(6) : RFValue(8),
    fontStyle: "italic",
    maxWidth: width > 600 ? 400 : "80%",
    justifyContent: "center",
    textAlign: "center",
  },
  overlayContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  templateImage: {
    width: width > 600 ? width * 0.86 : width * 0.90,
    height: width > 600 ? height * 0.86 : height * 0.90,
    resizeMode: "contain",
  },
  overlayContent: {
    position: "absolute",
    top: width > 600 ? "35%" : "43%",
    left: "50%",
    transform: [{ translateX: -width * 0.4 }, { translateY: -height * 0.2 }],
    width: width * 0.8,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  customImage: {
    width: width > 600 ? 100 : 60,
    height: width > 600 ? 100 : 60,
    borderRadius: 50,
    marginBottom: 6,
    marginTop: width > 600 ? 0 : "0%",
  },
  button: {
    backgroundColor: GlobalStyles.blue,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  customButtonStyle: {
    marginTop: 12,
    width: "32%",
    height: width > 600 ? 40 : 60
  },
  formText: {
    alignSelf: "flex-start",
    marginLeft: width > 600 ? "0%" : "15%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: GlobalStyles.darkGrey,
  },
  gradient: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  colorBox: {
    width: 50,
    height: 50,
    marginLeft: 10,
    borderRadius: 60,
    marginTop: 10,
    borderWidth: 1,
  },
});

export default withAuth(EsquelaCustomizer, [AUTHORITIES.CUSTOMER])