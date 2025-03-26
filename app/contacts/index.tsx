import { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text, Modal, TextInput, Alert } from 'react-native';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { GlobalStyles } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_API } from '@/constants/Mysc';

type EmergencyContact = {
  id: number;
  name: string;
  email: string;
  telephone: string;
};

function EmergencyContactScreen() {
 const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [editedContact, setEditedContact] = useState<EmergencyContact | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [editFormErrors, setEditFormErrors] = useState<string[]>([]);
  const [selectedContactToEdit, setSelectedContactToEdit] = useState<EmergencyContact | null>(null);
  const [hasContactChanges, setHasContactChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  interface EmergencyContact {
    id: number;
    name: string;
    email: string;
    telephone: string;
  };

  const fetchEmergencyContacts = async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) throw new Error('No se encontró un token de autenticación');
  
      const response = await fetch(`${BACKEND_API}/api/contacts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken.trim()}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
  
      const data = await response.json();
      setContacts(data); // ← Asumiendo que tienes un estado llamado setContacts
  
    } catch (error) {
      console.error('Error al obtener los contactos de emergencia:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      void fetchEmergencyContacts(); // Llamada al método que hace el fetch
    }, [])
  );
  
  
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
      !values.email ||
      typeof values.email !== "string" ||
      !emailRegex.test(values.email)
    ) {
      errors.push("El email no es válido.");
    }
  
    if (
      !values.telephone ||
      typeof values.telephone !== "string" ||
      !phoneRegex.test(values.telephone)
    ) {
      errors.push("Por favor, introduce un teléfono válido.");
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
  
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }
  
    setFormErrors([]);

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

  const fetchContactById = useCallback(async (contactId: number) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No se encontró el token de autenticación.');
  
      const endpoint = `${BACKEND_API}/api/contacts/${contactId}`; // ← ajusta al endpoint real
  
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo obtener los datos del contacto.`);
      }
  
      const data = await response.json();
  
      const contactData: EmergencyContact = {
        id: data.id,
        name: data.name || '',
        email: data.email || '',
        telephone: data.telephone || '',
      };
  
      setEditedContact(contactData);
      setEditFormErrors([]);
      setShowEditContactModal(true);
  
    } catch (error: any) {
      console.error('Error al obtener el contacto:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSaveEditedContact = async () => {
    console.log("hola")
    if (!editedContact) return;
  
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No se encontró el token de autenticación.');
  
      const endpoint = `${BACKEND_API}/api/contacts/${editedContact.id}`; // Ajusta al endpoint real
  
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editedContact.name,
          email: editedContact.email,
          telephone: editedContact.telephone,
        }),
      });
  
      if (!response.ok) throw new Error(`Error ${response.status}: No se pudo actualizar el contacto.`);
  
      Alert.alert('Éxito', 'El contacto ha sido actualizado correctamente.');
  
      // Cerrar modal y limpiar
      setShowEditContactModal(false);
      setEditedContact(null);
      setEditFormErrors([]);
  
    } catch (error: any) {
      console.error('Error al guardar el contacto:', error.message);
      Alert.alert('Error', error.message);
    }
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
                    <CustomButton title="Editar" onPress={() => setShowEditContactModal(true)} color="blue" />
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

            {formErrors.length > 0 && (
              <View style={styles.errorContainer}>
                {formErrors.map((error, index) => (
                  <Text key={index} style={styles.errorText}>
                    {error}
                  </Text>
                ))}
              </View>
            )}

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

      <Modal visible={showEditContactModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContentStyled}>
            <ThemedText style={styles.modalTitleStyled}>Editar contacto</ThemedText>

            {editFormErrors.length > 0 && (
              <View style={styles.errorContainer}>
                {editFormErrors.map((error, index) => (
                  <Text key={index} style={styles.errorText}>
                    {error}
                  </Text>
                ))}
              </View>
            )}

            <TextInput
              style={styles.modalInput}
              placeholder="Nombre completo"
              placeholderTextColor="#666"
              value={editedContact?.name || ''}
              onChangeText={(text) =>
                setEditedContact((prev) =>
                  prev ? { ...prev, name: text } : null
                )
              }
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Correo electrónico"
              placeholderTextColor="#666"
              keyboardType="email-address"
              value={editedContact?.email || ''}
              onChangeText={(text) =>
                setEditedContact((prev) =>
                  prev ? { ...prev, email: text } : null
                )
              }
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Teléfono"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={editedContact?.telephone || ''}
              onChangeText={(text) =>
                setEditedContact((prev) =>
                  prev ? { ...prev, telephone: text } : null
                )
              }
            />

            <View style={styles.verticalButtonContainer}>
              <CustomButton
                title="Guardar cambios"
                onPress={handleSaveEditedContact}
                color="blue"
              />
              <CustomButton
                title="Cancelar"
                onPress={() => {
                  setShowEditContactModal(false);
                  setEditedContact(null);
                  setEditFormErrors([]);
                }}
                color="red"
              />
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
  errorContainer: {
    backgroundColor: '#ffe6e6',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  
  
  
});

export default withAuth(EmergencyContactScreen, [AUTHORITIES.CUSTOMER_PREMIUM]);
