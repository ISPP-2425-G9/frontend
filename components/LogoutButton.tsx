import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from './CustomButton';
import CustomModal from './CustomModal';
import { ThemedText } from './ThemedText';

export default function LogoutButton() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
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
    setIsModalVisible(false);
  };

  return (
    <>
      <CustomButton 
        title="Cerrar Sesión" 
        onPress={() => setIsModalVisible(true)}
        color="grey"
        style={styles.button}
      />

      <CustomModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="Cerrar Sesión"
      >
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalText}>
            ¿Estás seguro que deseas cerrar sesión?
          </ThemedText>
          <View style={styles.modalButtons}>
            <CustomButton
              title="Cancelar"
              onPress={() => setIsModalVisible(false)}
              style={[styles.modalButton, styles.cancelButton]}
            />
            <CustomButton
              title="Confirmar"
              onPress={handleLogout}
              style={[styles.modalButton, styles.confirmButton]}
            />
          </View>
        </View>
      </CustomModal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  modalContent: {
    padding: 20,
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#000000',
  },
  confirmButton: {
    backgroundColor: '#E53935',
  }
}); 