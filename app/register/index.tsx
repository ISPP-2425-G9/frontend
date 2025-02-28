import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CustomModal from '@/components/CustomModal';
import TextInputArraysForm from '@/components/TextInputArraysForm';
import { GlobalStyles } from '@/constants/Colors';

const RegisterScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [userType, setUserType] = useState<'Empresa' | 'Cliente' | null>(null);

  const handleUserTypeSelection = (type: 'Empresa' | 'Cliente') => {
    setUserType(type);
    setModalVisible(false);
  };

  const handleSubmit = async (values: Record<string, string>) => {
    console.log('Form Submitted:', values);
  };

  const empresaFields = [
    { name: 'name', placeholder: 'Nombre de la Empresa' },
    { name: 'nif', placeholder: 'NIF' },
    { name: 'zip_code', placeholder: 'Código ZIP' },
    { name: 'telephone', placeholder: 'Teléfono' },
    { name: 'city', placeholder: 'Ciudad' },
    { name: 'address', placeholder: 'Dirección' },
    { name: 'description', placeholder: 'Descripción' },
    { name: 'email', placeholder: 'Email' },
    { name: 'password1', placeholder: 'Contraseña' },
    { name: 'password2', placeholder: 'Repita Contraseña' },
  ];

  const clienteFields = [
    { name: 'name', placeholder: 'Nombre de usuario' },
    { name: 'telephone', placeholder: 'Número de teléfono' },
    { name: 'dni', placeholder: 'DNI' },
    { name: 'email', placeholder: 'Email' },
    { name: 'password1', placeholder: 'Contraseña' },
    { name: 'password2', placeholder: 'Repita Contraseña' },
  ];

  return (
    <View style={styles.container}>
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
            inputs={empresaFields}
            onSubmit={handleSubmit}
            buttonText="Registrarse"
            style={styles.formStyle}
          />
        )}

        {userType === 'Cliente' && (
          <TextInputArraysForm
            title="Cuenta de usuario"
            inputs={clienteFields}
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
