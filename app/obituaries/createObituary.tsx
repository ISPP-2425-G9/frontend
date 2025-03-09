import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, TextInput, View, Text, Button, Image, Dimensions, Alert, Platform, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/components/CustomButton';
import { CustomTextInput } from '@/components/CustomTextInput';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import CustomModal from '@/components/CustomModal';
import { GlobalStyles } from '@/constants/Colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

type RootStackParamList = {
  'obituaries/selectContacts': { jsonData: string, is_newObituary: boolean, obituaryId: number };
  'obituaries/createObituary': { imageTemplateId: number; imageUrl: string, is_newObituary: boolean, obituaryId: number };
  'obituaries/index': { is_newObituary: boolean, obituaryId: number };
};

export default function EsquelaCustomizer() {

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, 'obituaries/createObituary'>>();

  const is_newObituary = route.params?.is_newObituary ?? true;

  const obituaryId = route.params?.obituaryId ?? undefined;

  const imageId = route.params?.imageTemplateId;

  const imageUrl = route.params?.imageUrl;

  const [modalVisible, setModalVisible] = useState(false);

  const [modalMessage, setModalMessage] = useState('');


  const [loading, setLoading] = useState(true);


  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    deathDate: '',
    farewellMessage: '',
    farewellPhrase: '',
    imageTemplate_id: imageId,
    customImage: null as string | null,
  });

  useEffect(() => {
    if (!is_newObituary) {
      const obituaryId = route.params?.obituaryId;
      const fetchData = async () => {
        setLoading(true);
        try {
          const authToken = await AsyncStorage.getItem('authToken');
          if (!authToken) throw new Error('No se encontró un token de autenticación');

          const response = await fetch(`http://localhost:8080/api/obituary/myObituaries/${obituaryId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken.trim()}`,
            },
          });

          if (!response.ok) throw new Error('Error al obtener los datos');

          const data = await response.json();

          setFormData({
            ...formData,
            name: data.name || '',
            birthDate: data.birthDate || '',
            deathDate: data.deathDate || '',
            farewellMessage: data.farewellMessage || '',
            farewellPhrase: data.farewellPhrase || '',
            customImage: data.customImage || null,
          });

        } catch (error) {
          console.error('Error en la solicitud:', error);
        } finally {
          setLoading(false);
        }
      };


      fetchData();
    } else {

      setFormData({
        name: '',
        birthDate: '',
        deathDate: '',
        farewellMessage: '', 
        farewellPhrase: '',
        customImage: null,
        imageTemplate_id: imageId || 0

      });

    }
  }, [route.params?.obituaryId, is_newObituary]);



  const changeDesign = async () => {
    const obituaryId = route.params?.obituaryId ?? undefined;
    navigation.navigate('obituaries/index' as never, { is_newObituary, obituaryId });
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

  const validateForm = () => {
    const { name, birthDate, farewellMessage, farewellPhrase, customImage } = formData;
    const errors: string[] = [];

    const birthDatePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (birthDate && !birthDate.match(birthDatePattern)) {
      errors.push('El formato de la fecha de nacimiento es incorrecto. Debe ser dd/mm/aaaa');
      return errors;
    }

    if (!name || !birthDate || !farewellMessage || !farewellPhrase) {
      if ( customImage === null) {
        setModalMessage('No has seleccionado una imagen y hay datos sin completar. ¿Desea continuar?');
      } else {
        setModalMessage('Hay datos sin completar. ¿Desea continuar?');
      }
    } else if (customImage === null) {
      setModalMessage('No has seleccionado una imagen. ¿Desea continuar?');
    } else {
      setModalMessage('¿Desea continuar?');
    }
    setModalVisible(true);

   
    return errors;
  }


  const showConfirmationModal = () => {

    try {
      const errors = validateForm();
      if (errors.length != 0 ) {
        throw new Error(`Hay error(es) en su formulario: ${errors}`)
      }

    } catch (error: any) {
          if (Platform.OS === 'web') {
            window.alert('Error: ' + error);
          } else {
            Alert.alert('Error', error);
          }
        }
  };

  const handleSubmit = () => {

    if (validateForm()) {
      const jsonData = JSON.stringify(formData, null, 2)
      navigation.navigate('obituaries/selectContacts' as never, { jsonData: jsonData, is_newObituary, obituaryId });
    } 
    setModalVisible(false);
        
  };

  return (
    <View style={styles.container}>
      <View style={styles.formSection}>

      <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 40 }}>
          {is_newObituary ? 'Crea tu esquela' : 'Edita tu esquela'}
        </Text>
        <Text>Nombre del fallecido:</Text>
        <CustomTextInput
          style={{ width: '75%' }}
          placeholder="Nombre"
          maxLength={37}
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
        />

        <Text>Año de nacimiento:</Text>
        <CustomTextInput
          style={{ width: '75%' }}
          placeholder="dd/mm/aaaa"
          value={formData.birthDate}
          maxLength={12}
          onChangeText={(text) => handleChange('birthDate', text)}
          keyboardType="numeric"
        />

        <Text>Año de fallecimiento:</Text>
        <CustomTextInput
          style={{ width: '75%' }}
          placeholder="Año de fallecimiento"
          value={formData.deathDate}
          maxLength={12}
          editable={false}
          onChangeText={(text) => handleChange('deathDate', text)}
          keyboardType="numeric"
        />

        <Text>Mensaje de despedida:</Text>
        <CustomTextInput
          style={[styles.textArea, { width: '75%' }]}
          placeholder="Escribe un mensaje de despedida"
          maxLength={624}
          multiline
          value={formData.farewellMessage}
          onChangeText={(text) => handleChange('farewellMessage', text)}
        />

        <Text>Frase de despedida:</Text>
        <CustomTextInput
          style={{ width: '75%' }}
          placeholder="Frase de despedida"
          maxLength={90}
          value={formData.farewellPhrase}
          onChangeText={(text) => handleChange('farewellPhrase', text)}
        />

        {!formData.deathDate && (
          <>
          
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', gap: 8, width: '75%' }}>
          <CustomButton style={{ marginTop: 12, width: '49%' }} title="Selecciona una imagen" onPress={pickImage} />
          <CustomButton style={{ marginTop: 12, width: '49%' }} title="Cambia el diseño de tu esquela" onPress={changeDesign} />
        </View>
        <CustomButton color="grey" style={{ marginTop: 12, width: '75%' }} title="Guardar y seleccionar contactos" onPress={showConfirmationModal} />
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
                  : require('@/assets/images/default-dark-image.jpg')
              }
              style={styles.customImage}
            />
            <Text style={styles.previewName}>{formData.name || 'Nombre '}</Text>
            <Text style={styles.previewDate}>{formData.birthDate || 'Año de nacimiento'} - {formData.deathDate || 'Año de fallecimiento'}</Text>
            <Text style={styles.previewText}>{formData.farewellMessage || 'Tu mensaje de despedida aparecerá aquí'}</Text>
            <Text style={styles.previewPhrase}>
              "{formData.farewellPhrase || 'Frase de despedida'}"
            </Text>
          </View>
        </View>
      </View>
      {modalVisible && (
        <CustomModal visible={modalVisible} onClose={handleCloseModal} title={modalMessage} style={styles.modalStyle}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleCloseModal()}>
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
  modalStyle: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: width > 600 ? '40%' : '80%',
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
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1%',
    flexDirection: 'row',
    width: '35%',
    gap: '2%',
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
    button: {
      backgroundColor: GlobalStyles.blue,
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
});


