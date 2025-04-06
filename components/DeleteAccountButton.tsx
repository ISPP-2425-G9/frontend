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
        onPress={() => { setIsModalVisible(true) }}
        color="red"
        style={styles.button}
      />

      <CustomModal
        visible={isModalVisible}
        onClose={() => { setIsModalVisible(false) }}
        title="Eliminar cuenta"
        style={styles.modalContent}
      >
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalText}>
            <p>¿Estás seguro que deseas eliminar tu cuenta permanentemente?</p>
            <p>Esta acción no se puede deshacer.</p>
          </ThemedText>
          <View style={styles.modalButtons}>
            <CustomButton
              title="Cancelar"
              onPress={() => { setIsModalVisible(false) }}
              style={StyleSheet.flatten([styles.modalButton, styles.cancelButton])}
            />
            <CustomButton
              title="Eliminar"
              onPress={handleDeleteAccount}
              style={StyleSheet.flatten([styles.modalButton, styles.deleteButton])}
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
    width: '90%',
    maxWidth: 400,
    padding: '2%',
  },
  modalText: {
    marginTop: -10,
    textAlign: 'center',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: GlobalStyles.blue,
  },
  deleteButton: {
    backgroundColor: GlobalStyles.red,
  }
});