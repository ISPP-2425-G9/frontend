import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CustomModal from '@/components/CustomModal';
import TextInputArraysForm from '@/components/TextInputArraysForm';
import { GlobalStyles } from '@/constants/Colors';
import { InputField } from '@/components/TextInputArraysForm';
import { BACKEND_API } from '@/constants/Mysc';

const { width, height } = Dimensions.get('window');


const LoginScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setModalVisible(true);
    }, [])
  );

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate('home' as never);
  };

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const response = await fetch(BACKEND_API+`/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: values.identifier, password: values.password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas.');
      }

      const data = await response.json();
      await AsyncStorage.setItem('userId', data.id);
      await AsyncStorage.setItem('authToken', data.token);
      if (Platform.OS === 'web') {
              window.alert('Inicio de sesión exitoso: Has iniciado sesión correctamente.');
            } else {
              Alert.alert('Inicio de sesión exitoso', 'Has iniciado sesión correctamente.');
            }
      setModalVisible(false); 
      navigation.navigate('home' as never);
    } catch (error: any) {
      if (Platform.OS === 'web') {
        window.alert(`Error: ${error.message}`);
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  const loginFields: InputField[] = [
    { name: 'identifier', placeholder: 'NIF, DNI o Email', keyboardType: 'default' },
    { name: 'password', placeholder: 'Contraseña', keyboardType: 'default', secureTextEntry: true },
  ];

  return (
    <View style={styles.container}>
      <CustomModal
        title='Accede a tu cuenta'
        visible={modalVisible}
        onClose={handleCloseModal}
        style={styles.modalStyle}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <TextInputArraysForm
              title=""
              inputs={loginFields}
              onSubmit={(values) => handleSubmit(values as Record<string, string>)}
              buttonText="Iniciar Sesión"
              style={styles.formStyle}
            />
          </View>
        </ScrollView>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.grey,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    width: '100%',
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
    width: width > 600 ? '50%' : '90%',
    maxWidth: 600,
    maxHeight: height * 0.7,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  formStyle: {
    marginTop: 10,
    borderRadius: 10,
    width: '100%',
    maxWidth: 550,
  },
});

export default LoginScreen;
