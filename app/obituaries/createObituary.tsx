import { useState } from 'react';
import { StyleSheet, TextInput, View, Text, Button, Image, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/components/CustomButton';
import { CustomTextInput } from '@/components/CustomTextInput';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function EsquelaCustomizer() {
  const [formData, setFormData] = useState({
    name: '',
    birthYear: '',
    deathYear: '',
    farewellMessage: '',
    farewellPhrase: '',
    customImage: null as string | null,
  });

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

  const exportToJson = () => {
    console.log(JSON.stringify(formData, null, 2));
  };

  return (
    <View style={styles.container}>
      {/* Sección izquierda: Formulario */}
      <View style={styles.formSection}>

        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 50 }}>Personaliza tu esquela</Text>

        <Text>Nombre del fallecido:</Text>
        <CustomTextInput
          style={{ width: 500 }}
          placeholder="Nombre"
          maxLength={50}
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
        />

        <Text>Año de nacimiento:</Text>
        <CustomTextInput
          style={{ width: 500 }}
          placeholder="Año de nacimiento"
          value={formData.birthYear}
          maxLength={4}
          onChangeText={(text) => handleChange('birthYear', text)}
          keyboardType="numeric"
        />

        <Text>Año de fallecimiento:</Text>
        <CustomTextInput
          style={{ width: 500 }}
          placeholder="Año de fallecimiento"
          value={formData.deathYear}
          maxLength={4}
          onChangeText={(text) => handleChange('deathYear', text)}
          keyboardType="numeric"
        />

        <Text>Mensaje de despedida:</Text>
        <CustomTextInput
          style={[styles.textArea, { width: 500 }]}
          placeholder="Escribe un mensaje de despedida"
          maxLength={250}
          value={formData.farewellMessage}
          onChangeText={(text) => handleChange('farewellMessage', text)}
          multiline
        />

        <Text>Frase de despedida:</Text>
        <CustomTextInput
          style={{ width: 500 }}
          placeholder="Frase de despedida"
          maxLength={80}
          value={formData.farewellPhrase}
          onChangeText={(text) => handleChange('farewellPhrase', text)}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 }}>
          <CustomButton title="Seleccionar Imagen" onPress={pickImage} />
          <CustomButton title="Exportar a JSON" onPress={exportToJson} />
        </View>

      </View>

      {/* Sección derecha: Previsualización */}
      <View style={styles.previewSection}>
        <View style={styles.overlayContainer}>
          <Image source={require('@/assets/images/esquela-template-2.jpeg')} style={styles.templateImage} />
          <View style={styles.overlayContent}>
            <Image
              source={
                formData.customImage
                  ? { uri: formData.customImage }
                  : require('@/assets/images/default-dark-image.jpg')
              }
              style={styles.customImage}
            />
            <Text style={styles.previewName}>{formData.name || 'Nombre '}</Text>
            <Text style={styles.previewDate}>{formData.birthYear || 'Año de nacimiento'} - {formData.deathYear || 'Año de fallecimiento'}</Text>
            <Text style={styles.previewText}>{formData.farewellMessage || 'Tu mensaje de despedida aparecerá aquí'}</Text>
            <Text style={styles.previewPhrase}>
              "{formData.farewellPhrase || 'Frase de despedida'}"
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    paddingTop: 110,
  },
  formSection: {
    flex: 1,
    paddingRight: 16,
    alignItems: 'center',
  },
  previewSection: {
    flex: 1,
    position: 'relative',
  },
  previewText: {
    fontSize: 15,
    maxWidth: 400,
    marginTop: 8,
    textAlign: 'justify',
  },
  previewName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    maxWidth: 400,
  },
  previewDate: {
    fontSize: 18,
    marginBottom: 8,
    maxWidth: 400,
    marginTop: 8, 
  },
  previewPhrase: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
    maxWidth: 400,
  },
  textArea: {
    height: 160,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  overlayContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  templateImage: {
    width: width * 0.83,
    height: height * 0.83,
    resizeMode: 'contain',
  },
  overlayContent: {
    position: 'absolute',
    alignItems: 'center',
    marginTop: 100,
  },
  customImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
});