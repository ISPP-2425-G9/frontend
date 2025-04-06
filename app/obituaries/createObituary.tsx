import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, View, Text, Image, Dimensions, Alert, Platform, TouchableOpacity, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "@/components/CustomButton";
import { CustomTextInput } from "@/components/CustomTextInput";
import { useNavigation, NavigationProp, useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import CustomModal from "@/components/CustomModal";
import { GlobalStyles } from "@/constants/Colors";
import { BACKEND_API } from "@/constants/Mysc";
import { withAuth } from "../_util/withAuth";
import { AUTHORITIES } from "../_util/Authorities";
import { RFValue, } from "react-native-responsive-fontsize";
import useAuth from "@/hooks/useAuth";
import { ThemedView } from "@/components/ThemedView";
import { useNotification } from '@/context/NotificationContext';

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
    selectedColor: string;
    is_visualization?: boolean;
  };
  "obituaries/index": {
    is_newObituary: boolean,
    obituaryId: number,
    jsonData: string,
    changeDesign: boolean,
    is_mine: boolean,
    selectedColor: string
  };
};

function EsquelaCustomizer() {

  const { showNotification } = useNotification();

  const [selectedColor, setSelectedColor] = useState("");

  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  const { isAuthenticated } = useAuth();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, "obituaries/createObituary">>();

  const is_newObituary = route.params?.is_newObituary ?? true;

  const obituaryId = route.params?.obituaryId ?? undefined;

  const is_visualization = route.params?.is_visualization ?? undefined;

  const imageId = route.params?.imageTemplateId;

  const imageUrl = route.params?.imageUrl;

  const [modalVisible, setModalVisible] = useState(false);

  const [modalMessage, setModalMessage] = useState("");

  const [loading, setLoading] = useState(true);

  const jsonData = route.params?.jsonData ?? undefined;

  const is_mine = route.params?.is_mine;

  const [isMine, setIsMine] = useState(Boolean);


  const [is_sended, setIsSended] = useState(false);

  const textColor = route.params?.selectedColor ?? "";

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
    setIsMine(is_mine)
  
  }
  , [is_mine])

  useFocusEffect(
    useCallback(() => {
      if (is_newObituary) {
        setFormData({
          name: "",
          birthDate: "",
          deathDate: "",
          farewellMessage: "",
          farewellPhrase: "",
          customImage: null,
          imageTemplate_id: imageId || 1,
        });
        setIsSended(false);
      }
    }, [is_newObituary, imageId])
  );


  useEffect(() => {
    const initializeForm = async () => {
      setLoading(true);
      setSelectedColor("")
      setIsMine(is_mine)

      if (jsonData && jsonData.trim() !== "") {
        try {
          const parsedData = JSON.parse(jsonData);
          setFormData({
            name: parsedData.name || "",
            birthDate: parsedData.birthDate || "",
            deathDate: parsedData.deathDate || "",
            farewellMessage: parsedData.farewellMessage || "",
            farewellPhrase: parsedData.farewellPhrase || "",
            customImage: parsedData.customImageUrl || null,
            imageTemplate_id: imageId|| 1,
          });
        
          setSelectedColor(textColor);
        } catch (error) {
          console.error("Error al parsear jsonData:", error);
        } finally {
          setLoading(false);
        }
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

          let formatDeathDate = "";
          if (data.deathDate) {
            const [year, month, day] = data.deathDate.split("-") || [];
            if (day && month && year) {
              formatDeathDate = `${day}/${month}/${year}`;
            }
          }

          setSelectedColor(`rgb(${data.wordColor})`);
          setIsMine(data.isMine);
          data.isMine ? setIsSended(false) : setIsSended(true);

          setFormData({
            name: data.name || "",
            birthDate: formatBirthDate || "",
            deathDate: formatDeathDate || "",
            farewellMessage: data.farewellMessage || "",
            farewellPhrase: data.farewellPhrase || "",
            customImage: data.customImageUrl || null,
            imageTemplate_id: data.imageTemplate.id || 1,
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
      is_mine,
      selectedColor
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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const allowedFormats = ["png", "jpg", "jpeg"];
      const filteredAssets = result.assets.filter(asset => {
        const fileExtension = asset.mimeType ? asset.mimeType.split("/")[1] : '';
        return allowedFormats.includes(fileExtension);
      });

      if (filteredAssets.length === 0) {
        showNotification({
          message: "Solo se permiten imágenes en formato PNG, JPG o JPEG",
          type: "error",
          duration: 2500,
        });
        return;
      }
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
    const { name, birthDate, deathDate, farewellMessage, farewellPhrase, customImage } =
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

      if ( birthDate && deathDate){
        const [birthDay, birthMonth, birthYear] = birthDate.split("/");
        const [deathDay, deathMonth, deathYear] = deathDate.split("/");

        const parsedBirthDate = new Date(`${birthYear}-${birthMonth}-${birthDay}`);
        const parsedDeathDate = new Date(`${deathYear}-${deathMonth}-${deathDay}`);

        if (parsedBirthDate > parsedDeathDate){
          errors.push("La fecha de nacimiento debe ser inferior a la fecha de fallecimiento")
          return errors;
        }
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
        showNotification({
          message:`Hay errores en su formulario: ${errors}`,
          type: "error",
          duration: 3000,
        });
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
          <Text style={styles.titlePage}>
            {isMine ?
              is_newObituary ? "Cree su esquela" : (is_visualization ? "Información de la esquela" : "Edita tu esquela"):
              is_newObituary ? "Cree la esquela para un ser querido" : "Información de la esquela"
            }
          </Text>
          <Text style={styles.formText}>Nombre del fallecido:</Text>
          <CustomTextInput
            style={{ width: "75%" }}
            placeholder="Nombre"
            maxLength={37}
            value={formData.name}
            onChangeText={(text) => { handleChange("name", text) }}
          />

          <Text style={styles.formText}>Fecha de nacimiento:</Text>
          <CustomTextInput
            style={{ width: "75%" }}
            placeholder="Fecha de nacimiento (dd/mm/aaaa)"
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

              if (year.length === 4 && inputDate > currentDate) {
                formatted = `${currentDate.getDate().toString().padStart(2, "0")}/${(currentDate.getMonth() + 1).toString().padStart(2, "0")}/${currentDate.getFullYear()}`;
              }

              handleChange("birthDate", formatted);
            }}
          />
          {
            !isMine && (
              <>
                <Text style={styles.formText}>Fecha de fallecimiento:</Text>
                <CustomTextInput
                  style={{ width: "75%" }}
                  placeholder={"Fecha de fallecimiento (dd/mm/aaaa)"}
                  value={formData.deathDate}
                  maxLength={12}
                  editable={!isMine ? true : false}
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
                    
                    if (year.length === 4 && inputDate > currentDate) {
                      formatted = `${currentDate.getDate().toString().padStart(2, "0")}/${(currentDate.getMonth() + 1).toString().padStart(2, "0")}/${currentDate.getFullYear()}`;
                    }
                  

                    handleChange("deathDate", formatted);
                  }}
                  keyboardType="numeric"
                />
              </>
            )
          }


          <Text style={styles.formText}>Mensaje de despedida:</Text>
          <CustomTextInput
            style={[{ width: "75%" }]}
            placeholder="Mensaje de despedida"
            value={formData.farewellMessage}
            maxLength={624}
            //multiline
            onChangeText={(text) => { handleChange("farewellMessage", text) }}
          />

          <Text style={styles.formText}>Frase de despedida:</Text>
          <CustomTextInput
            style={{ width: "75%" }}
            placeholder="Frase de despedida"
            maxLength={90}
            value={formData.farewellPhrase}
            onChangeText={(text) => { handleChange("farewellPhrase", text) }}
          />

          {(!is_sended && !is_visualization) && (
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
                  title="Seleccionar imagen"
                  onPress={pickImage}
                />
                <CustomButton
                  style={styles.customButtonStyle}
                  title="Cambiar color"
                  onPress={() => setColorPickerVisible(true)}
                />
                <CustomButton
                  style={styles.customButtonStyle}
                  title="Cambiar diseño"
                  onPress={changeDesign}
                />

              </View>
              <CustomButton
                color="grey"
                style={{ marginTop: 12, width: "75%", marginBottom: width > 600 ? 0 : 30 }}
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
                    onPress={() => { handleColorSelect(color) }}
                  />
                );
              })}
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => { setColorPickerVisible(false) }}
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
    paddingTop: 30,
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
    fontSize: width > 600 ? RFValue(5) : RFValue(7),
    maxWidth: width > 600 ? 400 : "80%",
    marginTop: 8,
    textAlign: "justify",
  },
  previewName: {
    fontSize: width > 600 ? RFValue(6) : RFValue(8.5),
    fontWeight: "bold",
    marginTop: 8,
    maxWidth: width > 600 ? 400 : '80%',
  },
  previewDate: {
    fontSize: width > 600 ? RFValue(6) : RFValue(8.5),
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
    fontSize: width > 600 ? RFValue(6.5) : RFValue(8.5),
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
    width: width > 600 ? width * 0.3 : width * 0.9,
    height: width > 600 ? height * 0.86 : height * 0.9,
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
    height: 40,
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
  titlePage: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: width > 600 ? "left" : "center",
    width: "100%",
  },
});

export default withAuth(EsquelaCustomizer, [AUTHORITIES.CUSTOMER])