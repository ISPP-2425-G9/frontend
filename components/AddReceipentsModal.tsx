import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { GlobalStyles } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface AddRecipientsModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (emails: string[]) => void;
  emails: string[]
}

const AddRecipientsModal: React.FC<AddRecipientsModalProps> = ({ visible, onClose, onConfirm, emails = [] }) => {
  const [email, setEmail] = useState('');
  const [emailList, setEmailList] = useState<string[]>(emails);

  const addEmail = () => {
    if (email.trim() && !emailList.includes(email.trim())) {
      setEmailList([...emailList, email.trim()]);
      setEmail('');
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmailList(emailList.filter((e) => e !== emailToRemove));
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Añadir destinatarios</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={GlobalStyles.darkGrey} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Introduce el correo"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              onSubmitEditing={addEmail}
            />
            <TouchableOpacity onPress={addEmail} style={styles.addButton}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={emailList}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.emailItem}>
                <Text style={styles.emailText}>{item}</Text>
                <TouchableOpacity onPress={() => removeEmail(item)}>
                  <Ionicons name="trash" size={20} color={GlobalStyles.red} />
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onConfirm(emailList)} style={styles.confirmButton}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: GlobalStyles.white,
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: GlobalStyles.darkGrey,
    borderRadius: 8,
    padding: 10,
    backgroundColor: GlobalStyles.white,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: GlobalStyles.blue,
    borderRadius: 8,
    padding: 10,
  },
  emailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: GlobalStyles.lightGrey,
    borderRadius: 8,
    marginBottom: 5,
  },
  emailText: {
    color: GlobalStyles.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: GlobalStyles.red,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 5,
  },
  confirmButton: {
    backgroundColor: GlobalStyles.blue,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddRecipientsModal;