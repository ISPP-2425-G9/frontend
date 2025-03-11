import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CustomModal from '@/components/CustomModal';
import TextInputArraysForm from '@/components/TextInputArraysForm';
import { GlobalStyles } from '@/constants/Colors';
import { InputField } from '@/components/TextInputArraysForm';
import { BACKEND_API } from '@/constants/Mysc';

const { width } = Dimensions.get('window');

const RegisterScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [userType, setUserType] = useState<'Empresa' | 'Cliente' | null>(null);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setUserType(null);
      setModalVisible(true);
    }, [])
  );

  const handleUserTypeSelection = (type: 'Empresa' | 'Cliente') => {
    setUserType(type);
    setModalVisible(false);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    if (!userType) {
      navigation.navigate('home' as never);
    }
  };

  const validateData = async (values: Record<string, string | { uri: string; name: string; type: string }>, uType: String | null) => {
    const errors: string[] = [];

    const emailRegex = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nifRegex = /^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/;
    const zipCodeRegex = /^\d{5}$/;
    const phoneRegex = /^\+?\d{9,15}$/;
    const dniRegex = /^\d{8}[A-Z]$/;


    if(uType === 'Empresa' ){

      if (!values.nif || typeof values.nif !== 'string' || !nifRegex.test(values.nif)) {
        errors.push('El NIF no es válido.');
      }

      if (!values.zipCode || typeof values.zipCode !== 'string' || !zipCodeRegex.test(values.zipCode)) {
          errors.push('El código postal debe tener 5 dígitos.');
      }

      if (!values.city || typeof values.city !== 'string' || values.city.trim() === '') {
        errors.push('La ciudad es obligatoria.');
      }

      if (!values.address || typeof values.address !== 'string' || values.address.trim() === '') {
          errors.push('La dirección es obligatoria.');
      }

      if (!values.description || typeof values.description !== 'string' || values.description.trim() === '') {
          errors.push('La descripción es obligatoria.');
      }

    }
    if(uType === 'Cliente') {
      if (!values.dni || typeof values.dni !== 'string' || !dniRegex.test(values.dni)) {
        errors.push('El DNI debe tener 8 números y una letra mayúscula.');
      }
    }
    if (!values.name || typeof values.name !== 'string' || values.name.trim() === '') {
        errors.push('El nombre es obligatorio.');
    }

    if (!values.telephone || typeof values.telephone !== 'string' || !phoneRegex.test(values.telephone)) {
        errors.push('Por favor, introduce un teléfono válido incluyendo el prefijo.');
    }


    if (!values.email || typeof values.email !== 'string' || !emailRegex.test(values.email)) {
        errors.push('El email no es válido.');
    }

    if (!values.password1 || typeof values.password1 !== 'string' || values.password1.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres.');
    }

    if (values.password1 !== values.password2) {
        errors.push('Las contraseñas no coinciden.');
    }

    return errors;
};


  const handleSubmit = async (values: Record<string, string | { uri: string; name: string; type: string }>) => {
    try {
      const errors: String[] = await validateData(values, userType);
      if(errors.length != 0){
        throw new Error(`Hay error(es) en su formulario: ${errors}`)
      }
      const reqUrl = userType == 'Empresa' ? 'api/auth/companies/signup' : 'api/auth/customers/signup';
      const response = await fetch(BACKEND_API+`/${reqUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error(`Hubo un problema al registrarse`);
      }
      
      const data = await response.json();
      await AsyncStorage.setItem('authToken', data.token);
      if (Platform.OS === 'web') {
        window.alert('Registro exitoso: Tu cuenta ha sido creada con éxito.');
      } else {
        Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada con éxito.');
      }
      navigation.navigate('home' as never);
    } catch (error: any) {
      if (Platform.OS === 'web') {
        window.alert('Error: ' + error);
      } else {
        Alert.alert('Error', error);
      }
    }
  };

  const companyFields: InputField[] = [
    { name: 'name', placeholder: 'Armando Paredes S.L.', keyboardType: 'default', description: 'Introduce el nombre de tu empresa' },
    { name: 'nif', placeholder: 'F1234567N', keyboardType: 'default', description: 'Introduce el NIF de tu empresa' },
    { name: 'zipCode', placeholder: '12345', keyboardType: 'default', description: 'Introduce el código postal de tu empresa' },
    { name: 'telephone', placeholder: '+34123456789', keyboardType: 'phone-pad', description: 'Introduce el teléfono de tu empresa (con prefijo)' },
    { name: 'city', placeholder: 'Sevilla', keyboardType: 'default', description: 'Introduce la ciudad de tu empresa' },
    { name: 'address', placeholder: 'C/ Arquimedes 3,14', keyboardType: 'default', description: 'Introduce la dirección de tu empresa' },
    { name: 'description', placeholder: 'Armamos paredes cuando quieras', keyboardType: 'default', description: 'Introduce una descripción de tu empresa' },
    { name: 'email', placeholder: 'armando@paredes.es', keyboardType: 'email-address', description: 'Introduce el email de tu empresa' },
    { name: 'password1', placeholder: '****', keyboardType: 'default', secureTextEntry: true, description: 'Introduce una contraseña' },
    { name: 'password2', placeholder: '****', keyboardType: 'default', secureTextEntry: true, description: 'Repite la contraseña' },
  ];

  const clientFields: InputField[] = [
    { name: 'name', placeholder: 'Peter Parker', keyboardType: 'default', description: 'Introduce tu nombre' },
    { name: 'telephone', placeholder: '+34000000000', keyboardType: 'phone-pad', description: 'Introduce tu teléfono (con prefijo)' },
    { name: 'dni', placeholder: '12345678P', keyboardType: 'default' , description: 'Introduce tu DNI' },
    { name: 'email', placeholder: 'peterparker@spider.com', keyboardType: 'email-address', description: 'Introduce tu email' },
    { name: 'password1', placeholder: '****', keyboardType: 'default', secureTextEntry: true, description: 'Introduce una contraseña' },
    { name: 'password2', placeholder: '****', keyboardType: 'default', secureTextEntry: true, description: 'Repite la contraseña' },
  ];


  return (
    <View style={styles.container}>
      <CustomModal
        visible={modalVisible}
        onClose={handleCloseModal}
        title="¿Qué tipo de usuario quieres ser?"
        style={styles.modalStyle}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => alert('Esta función no está disponible aún')}>
            <Text style={styles.buttonText}>Empresa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleUserTypeSelection('Cliente')}>
            <Text style={styles.buttonText}>Cliente</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {userType === 'Empresa' && (
          <TextInputArraysForm
            title="Cuenta de empresa"
            inputs={companyFields}
            imageFields={['logo']}
            onSubmit={handleSubmit}
            handleFormClose={ async ()=> { setUserType(null); setModalVisible(true);}}
            buttonText="Registrarse"
            style={styles.formStyle}
          />
        )}

        {userType === 'Cliente' && (
          <TextInputArraysForm
            title="Cuenta de usuario"
            inputs={clientFields}
            onSubmit={handleSubmit}
            handleFormClose={ async ()=> { setUserType(null); setModalVisible(true); }}
            buttonText="Registrarse"
            style={styles.formStyle}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.grey,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
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
    width: width > 600 ? '40%' : '80%', // Responsive modal width
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
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
  formStyle: {
    marginTop: 70,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: width > 600 ? '50%' : '90%', // Ajuste de ancho en móvil y escritorio
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default RegisterScreen;
