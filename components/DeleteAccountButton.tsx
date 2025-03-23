import { GlobalStyles } from '@/constants/Colors';
import { BACKEND_API } from '@/constants/Mysc';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomButton from './CustomButton';
import CustomModal from './CustomModal';
import { ThemedText } from './ThemedText';

export default function DeleteAccountButton() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      const response = await fetch(BACKEND_API + `/api/auth/${userId}`, {
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
        title="Eliminar cuenta"
        onPress={() => {setIsModalVisible(true)}}
        color="red"
        style={styles.button}
      />

      <CustomModal
        visible={isModalVisible}
        onClose={() => {setIsModalVisible(false)}}
        title="Eliminar cuenta"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalText}>
            <p>¿Estás seguro que deseas eliminar tu cuenta permanentemente?</p>
            <p>Esta acción no se puede deshacer.</p>
          </ThemedText>
          <View style={styles.modalButtons}>
            <CustomButton
              title="Eliminar"
              onPress={handleDeleteAccount}
              style={StyleSheet.flatten([styles.modalButton, styles.deleteButton])}
            />
            <CustomButton
              title="Cancelar"
              onPress={() => {setIsModalVisible(false)}}
              style={StyleSheet.flatten([styles.modalButton, styles.cancelButton])}
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
  modal: {
    padding: 20,
    width: 'auto',
  },
  modalContent: {
    padding: 10,
  },
  modalText: {
    textAlign: 'center',
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
    backgroundColor: GlobalStyles.blue,
  },
  deleteButton: {
    backgroundColor: GlobalStyles.red,
  }
});