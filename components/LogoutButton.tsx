import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomButton from './CustomButton';
import CustomModal from './CustomModal';
import { ThemedText } from './ThemedText';


export default function LogoutButton() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const navigation = useNavigation();
  
  const handleLogout = () => {
    try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        navigation.navigate('home' as never);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
    setIsModalVisible(false);
  };

  return (
    <>
      <CustomButton 
        title="Cerrar Sesión" 
        onPress={() => setIsModalVisible(true)}
        color="blue"
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
              style={styles.modalButton}
              color="red"
            />
            <CustomButton
              title="Confirmar"
              onPress={handleLogout}
              style={styles.modalButton}
              color="blue"
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
  }
}); 