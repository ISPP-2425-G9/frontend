import { useState } from 'react';
import { StyleSheet, TextInput, View, Text, Button, Image, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/components/CustomButton';
import { CustomTextInput } from '@/components/CustomTextInput';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

type RootStackParamList = {
  'obituaries/selectContacts': { jsonData: string };
  'obituaries/createObituary': { obituaryId: number; imageUrl: string };

};


export default function EsquelaCustomizer() {

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, 'obituaries/createObituary'>>();

  const imageUrl = route.params?.imageUrl;


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

  const selectContacts = () => {
    const jsonData = JSON.stringify(formData, null, 2)
    navigation.navigate('obituaries/selectContacts' as never, {jsonData: jsonData});
  };

  return (
    <View style={styles.container}>
      {/* Sección izquierda: Formulario */}
      <View style={styles.formSection}>

        <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 40 }}>Personaliza tu esquela</Text>

        <Text>Nombre del fallecido:</Text>
        <CustomTextInput
          style={{ width: 600 }}
          placeholder="Nombre"
          maxLength={37}
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
        />

        <Text>Año de nacimiento:</Text>
        <CustomTextInput
          style={{ width: 600 }}
          placeholder="Año de nacimiento"
          value={formData.birthYear}
          maxLength={10}
          onChangeText={(text) => handleChange('birthYear', text)}
          keyboardType="numeric"
        />

        <Text>Año de fallecimiento:</Text>
        <CustomTextInput
          style={{ width: 600 }}
          placeholder="Año de fallecimiento"
          value={formData.deathYear}
          maxLength={10}
          onChangeText={(text) => handleChange('deathYear', text)}
          keyboardType="numeric"
        />

        <Text>Mensaje de despedida:</Text>
        <CustomTextInput
          style={[styles.textArea, { width: 600 }]}
          placeholder="Escribe un mensaje de despedida"
          maxLength={624}
          multiline
          value={formData.farewellMessage}
          onChangeText={(text) => handleChange('farewellMessage', text)}
        />

        <Text>Frase de despedida:</Text>
        <CustomTextInput
          style={{ width: 600, textAlign: 'center' }}
          placeholder="Frase de despedida"
          maxLength={90}
          value={formData.farewellPhrase}
          onChangeText={(text) => handleChange('farewellPhrase', text)}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
          <CustomButton style={{ marginTop: 12 }} title="Selecciona una imagen" onPress={pickImage} />
          <CustomButton color="grey" style={{ marginTop: 12, marginLeft: 20, width: 380 }} title="Guardar y seleccionar contactos" onPress={selectContacts} />
        </View>
      </View>

      {/* Sección derecha: Previsualización */}
      <View style={styles.previewSection}>
        <View style={styles.overlayContainer}>
          <Image source={imageUrl} style={styles.templateImage} />
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
    paddingLeft: 100,
    alignItems: 'flex-start',
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
    justifyContent: 'center',
    textAlign: 'center',
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