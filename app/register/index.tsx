import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomModal from '@/components/CustomModal';
import TextInputArraysForm from '@/components/TextInputArraysForm';
import { GlobalStyles } from '@/constants/Colors';
import { InputField } from '@/components/TextInputArraysForm';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

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
      navigation.navigate('home');
    }
  };

  const handleSubmit = async (values: Record<string, string>) => {
    console.log('Form Submitted:', values);
  };

  const companyFields: InputField[] = [
    { name: 'name', placeholder: 'Nombre de la Empresa', keyboardType: 'default' },
    { name: 'nif', placeholder: 'NIF', keyboardType: 'default' },
    { name: 'zip_code', placeholder: 'Código ZIP', keyboardType: 'default' },
    { name: 'telephone', placeholder: 'Teléfono', keyboardType: 'phone-pad' },
    { name: 'city', placeholder: 'Ciudad', keyboardType: 'default' },
    { name: 'address', placeholder: 'Dirección', keyboardType: 'default' },
    { name: 'description', placeholder: 'Descripción', keyboardType: 'default' },
    { name: 'email', placeholder: 'Email', keyboardType: 'email-address' },
    { name: 'password1', placeholder: 'Contraseña', keyboardType: 'default', secureTextEntry: true },
    { name: 'password2', placeholder: 'Repita Contraseña', keyboardType: 'default', secureTextEntry: true },
  ];

  const clientFields: InputField[] = [
    { name: 'name', placeholder: 'Nombre de usuario', keyboardType: 'default' },
    { name: 'telephone', placeholder: 'Número de teléfono', keyboardType: 'phone-pad' },
    { name: 'dni', placeholder: 'DNI', keyboardType: 'default' },
    { name: 'email', placeholder: 'Email', keyboardType: 'email-address' },
    { name: 'password1', placeholder: 'Contraseña', keyboardType: 'default', secureTextEntry: true },
    { name: 'password2', placeholder: 'Repita Contraseña', keyboardType: 'default', secureTextEntry: true },
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
          <TouchableOpacity style={styles.button} onPress={() => handleUserTypeSelection('Empresa')}>
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
            onSubmit={handleSubmit}
            buttonText="Registrarse"
            style={styles.formStyle}
          />
        )}

        {userType === 'Cliente' && (
          <TextInputArraysForm
            title="Cuenta de usuario"
            inputs={clientFields}
            onSubmit={handleSubmit}
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
    width: '30%',
    shadowRadius: 5,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '65%',
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
    marginTop: '5%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '45%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default RegisterScreen;
