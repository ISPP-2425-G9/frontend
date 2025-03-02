import { useState } from 'react';
import { StyleSheet, TextInput, View, Text, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/components/CustomButton';
import { CustomTextInput } from '@/components/CustomTextInput';

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

        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Personaliza tu esquela</Text>

        <Text>Nombre del fallecido:</Text>
        <CustomTextInput
          style={styles.input}
          placeholder="Nombre"
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
        />

        <Text>Año de nacimiento:</Text>
        <CustomTextInput
          style={styles.input}
          placeholder="Año de nacimiento"
          value={formData.birthYear}
          onChangeText={(text) => handleChange('birthYear', text)}
          keyboardType="numeric"
        />

        <Text>Año de fallecimiento:</Text>
        <CustomTextInput
          style={styles.input}
          placeholder="Año de fallecimiento"
          value={formData.deathYear}
          onChangeText={(text) => handleChange('deathYear', text)}
          keyboardType="numeric"
        />

        <Text>Mensaje de despedida:</Text>
        <CustomTextInput
          style={[styles.input, styles.textArea]}
          placeholder="Escribe un mensaje de despedida"
          value={formData.farewellMessage}
          onChangeText={(text) => handleChange('farewellMessage', text)}
          multiline
        />

        <Text>Frase de despedida:</Text>
        <CustomTextInput
          style={styles.input}
          placeholder="Frase de despedida"
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
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Vista Previa</Text>
        <View style={styles.overlayContainer}>
          <Image source={require('@/assets/images/esquela-template-2.jpeg')} style={styles.templateImage} />
          <View style={styles.overlayContent}>
            {formData.customImage && (
              <Image source={{ uri: formData.customImage }} style={styles.customImage} />
            )}
            <Text>En memoria de: {formData.name || 'Nombre aquí'}</Text>
            <Text>{formData.birthYear || 'Año de nacimiento'} - {formData.deathYear || 'Año de fallecimiento'}</Text>
            <Text>{formData.farewellMessage || 'Tu mensaje de despedida aparecerá aquí'}</Text>
            <Text>"{formData.farewellPhrase || 'Frase de despedida aquí'}"</Text>
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
  },
  previewSection: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
    borderRadius: 8,
  },
  textArea: {
    height: 100,
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
    width: '100%',
    height: 700,
    resizeMode: 'contain',
  },
  overlayContent: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    marginTop: 200,
  },
  customImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
});