import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from './CustomButton';
import CustomModal from './CustomModal';
import { ThemedText } from './ThemedText';
import { BACKEND_API } from '@/constants/Mysc';

export default function DeleteAccountButton() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      const response = await fetch(BACKEND_API+`/api/auth/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 204) {
        await localStorage.clear();
        router.replace('/login');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setIsModalVisible(false);
  };

  return (
    <>
      <CustomButton 
        title="Eliminar Cuenta" 
        onPress={() => setIsModalVisible(true)}
        color="red"
        style={styles.button}
      />

      <CustomModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="Eliminar Cuenta"
      >
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalText}>
            ¿Estás seguro que deseas eliminar tu cuenta permanentemente?
            Esta acción no se puede deshacer.
          </ThemedText>
          <View style={styles.modalButtons}>
            <CustomButton
              title="Cancelar"
              onPress={() => setIsModalVisible(false)}
              style={[styles.modalButton, styles.cancelButton]}
            />
            <CustomButton
              title="Eliminar"
              onPress={handleDeleteAccount}
              style={[styles.modalButton, styles.deleteButton]}
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
    backgroundColor: '#4A4A4A',
  },
  deleteButton: {
    backgroundColor: '#E53935',
  }
});