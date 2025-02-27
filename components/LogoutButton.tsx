import React from 'react';
import { useRouter } from 'expo-router';
import CustomButton from './CustomButton';
import CustomModal from './CustomModal';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { GlobalStyles } from '@/constants/Colors';

const LogoutButton = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = await localStorage.getItem('token');
      const response = await fetch('api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await localStorage.removeItem('token');
        await localStorage.removeItem('userData');
        router.replace('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
    setModalVisible(false);
  };

  return (
    <>
      <CustomButton 
        title="Cerrar Sesión" 
        onPress={() => setModalVisible(true)}
        color="red"
      />

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Cerrar Sesión"
      >
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalText}>
            ¿Estás seguro que deseas cerrar sesión?
          </ThemedText>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Cancelar"
              onPress={() => setModalVisible(false)}
              color="grey"
              style={styles.button}
            />
            <CustomButton
              title="Confirmar"
              onPress={handleLogout}
              color="red"
              style={styles.button}
            />
          </View>
        </View>
      </CustomModal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    alignItems: 'center',
    padding: 20,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  button: {
    flex: 1,
  }
});

export default LogoutButton; 