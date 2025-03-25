import { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text, Modal, TextInput, Alert } from 'react-native';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import { GlobalStyles } from '@/constants/Colors';

type EmergencyContact = {
  id: number;
  name: string;
  email: string;
  telephone: string;
};

function EmergencyContactScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', telephone: '600123456' },
    { id: 2, name: 'Ana García', email: 'ana@example.com', telephone: '699654321' },
    { id: 3, name: 'Carlos Ruiz', email: 'carlos@example.com', telephone: '611223344' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const validateEmergencyContact = async (
    values: Record<string, string>
  ): Promise<string[]> => {
    const errors: string[] = [];
  
    const emailRegex = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\+?\d{9,15}$/;
  
    if (
      !values.name ||
      typeof values.name !== "string" ||
      values.name.trim() === ""
    ) {
      errors.push("El nombre es obligatorio.");
    }
  
    if (
      !values.telephone ||
      typeof values.telephone !== "string" ||
      !phoneRegex.test(values.telephone)
    ) {
      errors.push("Por favor, introduce un teléfono válido.");
    }
  
    if (
      !values.email ||
      typeof values.email !== "string" ||
      !emailRegex.test(values.email)
    ) {
      errors.push("El email no es válido.");
    }
  
    return errors;
  };
  

  const handleAddContact = async () => {
    const values = {
      name: contactName,
      email: contactEmail,
      telephone: contactPhone,
    };
  
    const errors = await validateEmergencyContact(values);
    console.log(errors)
  
    if (errors.length > 0) {
      Alert.alert("Errores en el formulario", errors.join("\n"));
      return;
    }
  
    const contactToSend = {
      fullName: contactName,
      email: contactEmail,
      telephone: contactPhone,
    };
  
    console.log("Contacto de emergencia guardado:", contactToSend);
    setShowAddContactModal(false);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
  };
  
  


  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>Contactos de Emergencia</Text>
          <Text style={styles.introText}>
            Aquí podrás gestionar tus <Text style={styles.highlight}>contactos de emergencia</Text>,
            para que en caso de que notemos inactividad en tu cuenta, contactemos con estas personas
            para recordarles que tienes una cuenta con nosotros la cual has estado pagando y que tienes
            mensajes para enviar.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Añadir nuevo contacto"
            onPress={() => setShowAddContactModal(true) }
            color="green"
          />
        </View>

        <ScrollView horizontal style={styles.horizontalScroll}>
          <View style={styles.tableWrapper}>
            <CustomTable
              columns={['NOMBRE', 'EMAIL', 'TELÉFONO', 'ACCIONES']}
              columnWidths={[1.2, 1.1, 1.05, 1.2]}
            >
              {contacts.map((contact) => (
                <View key={contact.id} style={styles.row}>
                  <ThemedText style={styles.cell}>{contact.name}</ThemedText>
                  <ThemedText style={styles.cell}>{contact.email}</ThemedText>
                  <ThemedText style={styles.cell}>{contact.telephone}</ThemedText>
                  <View style={styles.actions}>
                    <CustomButton title="Editar" onPress={() => console.log("Editar contacto")} color="blue" />
                    <CustomButton
                      title="Eliminar"
                      onPress={() => {
                        setSelectedContactId(contact.id);
                        setModalVisible(true);
                      }}
                      color="red"
                    />
                  </View>
                </View>
              ))}
            </CustomTable>
          </View>
        </ScrollView>

        <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)} title="Confirmar Eliminación">
          <ThemedText>¿Estás seguro de que deseas eliminar este contacto?</ThemedText>
          <View style={styles.modalButtons}>
            <CustomButton title="Cancelar" onPress={() => setModalVisible(false)} color="grey" />
            <CustomButton
              title="Eliminar"
              onPress={() => {
                console.log("Eliminar contacto");
                // Aquí iría la lógica real de eliminación
                //setContacts(prev => prev.filter(c => c.id !== selectedContactId));
                setModalVisible(false);
              }}
              color="red"
            />
          </View>
        </CustomModal>
      </ScrollView>

      <Modal visible={showAddContactModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContentStyled}>
            <ThemedText style={styles.modalTitleStyled}>Añadir contacto de emergencia</ThemedText>

            <TextInput
              style={styles.modalInput}
              placeholder="Nombre completo"
              placeholderTextColor="#666"
              value={contactName}
              onChangeText={setContactName}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Correo electrónico"
              placeholderTextColor="#666"
              keyboardType="email-address"
              value={contactEmail}
              onChangeText={setContactEmail}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Teléfono"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={contactPhone}
              onChangeText={setContactPhone}
            />

            <View style={styles.verticalButtonContainer}>
              <CustomButton title="Guardar" onPress={handleAddContact} color="blue" />
              <CustomButton title="Cancelar" onPress={() => setShowAddContactModal(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: GlobalStyles.white,
    paddingTop: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
    alignItems: 'center',
  },
  introContainer: {
    width: '90%',
    backgroundColor: GlobalStyles.lightGrey,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: GlobalStyles.darkGrey,
    marginBottom: 10,
    textAlign: 'center',
  },
  introText: {
    fontSize: 18,
    color: GlobalStyles.darkGrey,
    textAlign: 'center',
    lineHeight: 22,
  },
  highlight: {
    fontWeight: 'bold',
    color: GlobalStyles.blue,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  horizontalScroll: {
    width: '100%',
  },
  tableWrapper: {
    width: '100%',
    minWidth: Dimensions.get('window').width,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: GlobalStyles.grey,
    alignItems: 'center',
    backgroundColor: GlobalStyles.lightGrey,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: GlobalStyles.font,
    color: GlobalStyles.darkGrey,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalContentStyled: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '85%',
    gap: 10,
  },
  
  modalTitleStyled: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  modalInput: {
    width: '100%',
    backgroundColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'left',
  },
  
  verticalButtonContainer: {
    flexDirection: 'column',
    gap: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  
  
});

export default withAuth(EmergencyContactScreen, [AUTHORITIES.CUSTOMER_PREMIUM]);
