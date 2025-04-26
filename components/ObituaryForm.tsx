import React, { useState } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleProp } from 'react-native';
import CustomTextInput from '@/components/CustomTextInput';
import DatePickerInput from '@/components/DatePickerInput';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import { ThemedView } from '@/components/ThemedView';
import { useNotification } from '@/context/NotificationContext';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, NavigationProp } from "@react-navigation/native";

type Mode = 'create' | 'edit' | 'view';


type RootStackParamList = {
    "obituaries/index": {
      is_newObituary: boolean,
      obituaryId: number,
      jsonData: string,
      changeDesign: boolean,
      is_mine: boolean,
      selectedColor: string
    };

    "obituaries/selectContacts": {
    jsonData: string,
    is_newObituary: boolean,
    obituaryId: number,
    is_mine: boolean,
  };
};

interface FormData {
  name: string;
  birthDate: string;
  deathDate?: string;
  farewellMessage: string;
  farewellPhrase: string;
  customImage?: string;
}


interface ObituaryFormProps {
  isAuthenticated: boolean;
  mode: Mode;
  obituaryId: number;
  is_newObituary: boolean;
  is_mine: boolean;
  letterColor: string;
  formData: FormData;
  imageUrl: string;
  styles: { [key: string]: StyleProp<any> };
}

export default function ObituaryForm({

  isAuthenticated,
  mode,
  obituaryId,
  is_mine,
  is_newObituary,
  letterColor,
  formData,
  imageUrl,
  styles,
}: ObituaryFormProps) {

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    

  const [localFormData, setLocalFormData] = useState<FormData>(formData);
  const { showNotification } = useNotification();
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(letterColor ?? 'rgb(0,0,0)');


  const isVisualization = mode === 'view';

  const titleMap: Record<Mode, string> = {
    create: is_mine ? 'Crea tu esquela' : 'Cree la esquela para un ser querido',
    edit: is_mine ? 'Edita tu esquela' : 'Información de la esquela',
    view: 'Información de la esquela',
  };

  const handleFieldChange = (field: string, value: string) => {
    setLocalFormData({ ...localFormData, [field]: value });
  };

  const [modalMessage, setModalMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);



  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const allowedFormats = ['png', 'jpg', 'jpeg'];
      const filteredAssets = result.assets.filter(asset => {
        const fileExtension = asset.mimeType ? asset.mimeType.split('/')[1] : '';
        return allowedFormats.includes(fileExtension);
      });

      if (filteredAssets.length === 0) {
        showNotification({
          message: 'Solo se permiten imágenes en formato PNG, JPG o JPEG',
          type: 'error',
          duration: 2500,
        });
        return;
      }

      handleFieldChange('customImage', filteredAssets[0].uri);
    }
  };

  const changeDesign = async () => {
    const is_newObituary = mode === 'create';
    const jsonData = JSON.stringify(localFormData, null, 2);

    navigation.navigate('obituaries/index', {
      is_newObituary,
      obituaryId,
      jsonData,
      changeDesign: true,
      is_mine,
      selectedColor,
    });
  };

  const showConfirmationModal = () => {
    try {
      const errors = validateForm();
      if (errors.length != 0) {
        showNotification({
          message: errors.join(', '),
          type: "error",
          duration: 3000,
        });
      }
    } catch (error: any) {
      showNotification({
        message: "Error: " + error,
        type: "error",
        duration: 3000
      })
    }
  };


  const validateForm = () => {
    const { name, birthDate, deathDate, farewellMessage, farewellPhrase, customImage } = localFormData;
    const errors: string[] = [];

    const birthDatePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (birthDate && !birthDate.match(birthDatePattern)) {
      errors.push(
        "El formato de la fecha de nacimiento es incorrecto. Debe ser dd/mm/aaaa"
      );
      return errors;
    }

    if (!name || !birthDate || !farewellMessage || !farewellPhrase) {
      if (customImage === undefined) {
        setModalMessage(
          "No has seleccionado una imagen y hay datos sin completar. ¿Desea continuar?"
        );
      } else {
        setModalMessage("Hay datos sin completar. ¿Desea continuar?");
      }

      if (birthDate && deathDate) {
        const [birthDay, birthMonth, birthYear] = birthDate.split("/");
        const [deathDay, deathMonth, deathYear] = deathDate.split("/");

        const parsedBirthDate = new Date(`${birthYear}-${birthMonth}-${birthDay}`);
        const parsedDeathDate = new Date(`${deathYear}-${deathMonth}-${deathDay}`);

        if (parsedBirthDate > parsedDeathDate) {
          errors.push("La fecha de nacimiento debe ser anterior a la fecha de fallecimiento")
          return errors;
        }
      }
    } else {
      setModalMessage(customImage === undefined ?
        "No has seleccionado una imagen y hay datos sin completar. ¿Desea continuar?" :
        "Hay datos sin completar. ¿Desea continuar?");
    }

    if (birthDate && deathDate) {
      const [birthDay, birthMonth, birthYear] = birthDate.split("/");
      const [deathDay, deathMonth, deathYear] = deathDate.split("/");

      const parsedBirthDate = new Date(`${birthYear}-${birthMonth}-${birthDay}`);
      const parsedDeathDate = new Date(`${deathYear}-${deathMonth}-${deathDay}`);

      if (parsedBirthDate > parsedDeathDate) {
        errors.push("La fecha de nacimiento debe ser inferior a la fecha de fallecimiento")
        return errors;
      }
    }
    setModalMessage(
      customImage === undefined
        ? "No has seleccionado una imagen. ¿Desea continuar?"
        : "¿Desea continuar?"
    );
    setModalVisible(true);
    return errors;
  };


  const handleSubmit = () => {
    if (validateForm()) {
      const jsonData = JSON.stringify(localFormData, null, 2);
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
      });
    }
    setModalVisible(false);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleCloseModalColors = () => {
    setColorPickerVisible(false);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setColorPickerVisible(false);
  };

  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <Text style={styles.title}>
          Debes iniciar sesión para poder acceder a esta sección
        </Text>
      </ThemedView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.formSection}>
          <Text style={styles.titlePage}>{titleMap[mode]}</Text>

          <Text style={styles.formText}>Nombre del fallecido:</Text>
          <CustomTextInput
            containerStyle={{ width: '75%' }}
            placeholder="Nombre"
            maxLength={37}
            value={localFormData.name}
            onChangeText={text => handleFieldChange('name', text)}
            editable={!isVisualization}
          />

          <Text style={styles.formText}>Fecha de nacimiento:</Text>
          <DatePickerInput
            containerStyle={{ width: '75%' }}
            placeholder="Fecha de nacimiento (dd/mm/aaaa)"
            value={localFormData.birthDate}
            type="birthDate"
            handleChange={handleFieldChange}
            editable={!isVisualization}
          />

          {!is_mine && (
            <>
              <Text style={styles.formText}>Fecha de fallecimiento:</Text>
              <DatePickerInput
                containerStyle={{ width: '75%' }}
                placeholder="Fecha de fallecimiento (dd/mm/aaaa)"
                value={localFormData.deathDate || ''}
                type="deathDate"
                handleChange={handleFieldChange}
                editable={!isVisualization}
              />
            </>
          )}

          <Text style={styles.formText}>Mensaje de despedida:</Text>
          <CustomTextInput
            containerStyle={{ width: '75%' }}
            placeholder="Mensaje de despedida"
            value={localFormData.farewellMessage}
            maxLength={624}
            onChangeText={text => handleFieldChange('farewellMessage', text)}
            editable={!isVisualization}
          />

          <Text style={styles.formText}>Frase de despedida:</Text>
          <CustomTextInput
            containerStyle={{ width: '75%' }}
            placeholder="Frase de despedida"
            maxLength={90}
            value={localFormData.farewellPhrase}
            onChangeText={text => handleFieldChange('farewellPhrase', text)}
            editable={!isVisualization}
          />

          {mode !== 'view' && (
            <>
              <View style={styles.buttonRow}>
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
                style={styles.updateContactsButton}
                title={mode === 'create' ? 'Seleccionar contactos' : 'Actualice sus contactos'}
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
                  localFormData.customImage
                    ? { uri: localFormData.customImage }
                    : require('@/assets/images/default-dark-image.jpg')
                }
                style={styles.customImage}
              />
              <Text style={[styles.previewName, { color: selectedColor }]}> {localFormData.name || 'Nombre '}</Text>
              <Text style={[styles.previewDate, { color: selectedColor }]}> {localFormData.birthDate || 'Año de nacimiento'} – {localFormData.deathDate || 'Año de fallecimiento'}</Text>
              <Text style={[styles.previewText, { color: selectedColor }]}> {localFormData.farewellMessage || 'Tu mensaje de despedida aparecerá aquí'}</Text>
              <Text style={[styles.previewPhrase, { color: selectedColor }]}> "{localFormData.farewellPhrase || 'Frase de despedida'}"</Text>
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
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </CustomModal>
        )}

        {/* Modal selector de color */}
        {colorPickerVisible && (
          <CustomModal
            visible={colorPickerVisible}
            onClose={handleCloseModalColors}
            style={styles.modalStyle}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Selecciona un color</Text>
              <View style={styles.gradient}>
                {Array.from({ length: 10 }).map((_, index) => {
                  const color = [
                    'rgb(253, 111, 111)',
                    'rgb(209, 181, 129)',
                    'rgb(195, 221, 255)',
                    'rgb(190, 177, 161)',
                    'rgb(60, 179, 113)',
                    'rgb(255, 255, 255)',
                    'rgb(150, 150, 150)',
                    'rgb(100, 100, 100)',
                    'rgb(33, 33, 33)',
                    'rgb(0,0,0)',
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
              <TouchableOpacity style={styles.button} onPress={handleCloseModalColors}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </CustomModal>
        )}
      </View>
    </ScrollView>
  );
}
