import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GlobalStyles } from '@/constants/Colors';
import { BACKEND_API } from '@/constants/Mysc';
import { useNotification } from '@/context/NotificationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AUTHORITIES } from '../_util/Authorities';
import { withAuth } from '../_util/withAuth';


function EmergencyContactScreen() {
  type EmergencyContact = {
    id: number;
    name: string;
    email: string;
    telephone: string;
  };
  
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [, setEditedContact] = useState<EmergencyContact | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [editFormErrors, setEditFormErrors] = useState<string[]>([]);
  const [selectedContactToEdit, setSelectedContactToEdit] = useState<EmergencyContact | null>(null);
  const [, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const formatPhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  };

  const closeAddContactModal = () => {
    setShowAddContactModal(false);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setFormErrors([]);
  };
  
  const validateContact = async (
    values: Record<string, string>
  ): Promise<string[]> => {
    const errors: string[] = [];
  
    const emailRegex = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{3} \d{3} \d{3}$/;
  
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

  const fetchContacts = async () => {
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
      setContacts(data);
  
    } catch (error) {
      console.error('Error al obtener los contactos de emergencia:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      void fetchContacts();
    }, [])
  );

  const handleDeleteContact = async () => {
    
    if (!selectedContactId) return;
  
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) throw new Error('No se encontró un token de autenticación');
  
      const response = await fetch(`${BACKEND_API}/api/contacts/${selectedContactId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken.trim()}`,
        },
      });
  
      if (response.status === 204) {
        setModalVisible(false);
        setSelectedContactId(null);
        fetchContacts();
      } else {
        console.error(`Error al eliminar el contacto: ${response.status}`);
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación:', error);
    }
  };

  const handleAddContact = async (values: Record<string, string>) => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("No se encontró el token de autenticación.");
      }
  
      const errors: string[] = await validateContact(values);
      if (errors.length > 0) {
        setFormErrors(errors);
        return;
      } else {
        setFormErrors([]);
      }
  
      const response = await fetch(`${BACKEND_API}/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.trim()}`,
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          telephone: values.telephone.replace(/\s+/g, ''),
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        const errorMessage =
          data.error ||
          (data.errors ? Object.values(data.errors).flat().join("\n") : "Error inesperado.");
        throw new Error(errorMessage);
      }
  
      showNotification({
        message: "Añadido correctamente",
        type: "success",
      });
      showNotification
      closeAddContactModal(); 
      fetchContacts();
  
    } catch (error: any) {
      console.error("Error al añadir contacto:", error);
      setFormErrors([error.message || "Error inesperado"]);
      showNotification({
        message: error.message || "Error inesperado",
        type: "error",
      });
    }
  };

  const handleEditContact = async (values: Record<string, string>) => {
    if (!selectedContactToEdit?.id) return;
  
    const errors = await validateContact(values);
    if (errors.length > 0) {
      setEditFormErrors(errors);
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("No se encontró el token de autenticación.");
  
      const response = await fetch(`${BACKEND_API}/api/contacts/${selectedContactToEdit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: selectedContactToEdit.id,
          name: values.name,
          email: values.email,
          telephone: values.telephone.replace(/\s+/g, ''),
        }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        const backendErrors: string[] =
          data.errors
            ? Object.values(data.errors).flat()
            : data.error
              ? [data.error]
              : [`Error ${response.status}: No se pudo actualizar el contacto.`];
      
        setEditFormErrors(backendErrors);
        return;
      }
  
      showNotification({
        message: "El contacto ha sido actualizado correctamente.",
        type: "success",
      });
      setShowEditContactModal(false);
      setSelectedContactToEdit(null);
      setEditFormErrors([]);
      fetchContacts();
    } catch (error: any) {
      console.error("Error al actualizar contacto:", error.message);
      showNotification({
        message: error.message || "Error inesperado",
        type: "error",
      });
    }
  };
  
  
  
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>Contactos de emergencia</Text>
          <Text style={styles.introText}>
            Aquí podrás gestionar tus <Text style={styles.highlight}>contactos de emergencia</Text>,
            para que en caso de que notemos inactividad en tu cuenta, contactemos con estas personas
            para recordarles que tienes una cuenta con nosotros la cual has estado pagando y que tienes
            mensajes para enviar.
          </Text>
        </View>

        <View style={{ width: '100%', alignItems: 'center' }}>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Añadir nuevo contacto"
              onPress={() => setShowAddContactModal(true) }
              color="green"
            />
          </View>

          <ScrollView horizontal style={styles.tableScrollContainer} contentContainerStyle={styles.tableScrollContent}>
            <View style={styles.tableWrapper}>
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Nombre</Text>
                <Text style={styles.headerCell}>Email</Text>
                <Text style={styles.headerCell}>Teléfono</Text>
                <Text style={styles.headerCell}>Acciones</Text>
              </View>
              {contacts.map((contact) => (
                <View key={contact.id} style={styles.tableRow}>
                  <View style={styles.cell}><Text style={styles.cellText}>{contact.name}</Text></View>
                  <View style={styles.cell}><Text style={styles.cellText}>{contact.email}</Text></View>
                  <View style={styles.cell}>
                    <Text style={styles.cellText}>
                      {contact.telephone.replace(/\D/g, '').replace(/(\d{3})/g, '$1 ').trim()}
                    </Text>
                  </View>
                  <View style={styles.cell}>
                    <View style={styles.actionButtonsContainer}>
                      <CustomButton title="Editar" onPress={() => { const formattedTelephone = contact.telephone.replace(/\D/g, '').replace(/(\d{3})/g, '$1 ').trim();
                                                                                                setSelectedContactToEdit({ ...contact, telephone: formattedTelephone });
                                                                                                setShowEditContactModal(true);}} color="blue" style={styles.actionsButton} />
                      <CustomButton title="Eliminar" onPress={() => { setSelectedContactId(contact.id); setModalVisible(true); }} color="red" style={styles.actionsButton} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)} title="Confirmar eliminación">
          <ThemedText>¿Estás seguro de que deseas eliminar este contacto?</ThemedText>
          <View style={styles.modalButtons}>
            <CustomButton title="Cancelar" onPress={() => setModalVisible(false)} color="grey" />
            <CustomButton
              title="Eliminar"
              onPress={() => {
                handleDeleteContact();
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
              maxLength={11}
              value={contactPhone}
              onChangeText={(text) => {
                const numericText = text.replace(/\D/g, "");
                const formattedText = numericText.replace(/(\d{3})/g, "$1 ").trim();
                setContactPhone(formattedText);
              }}              

            />

            <View style={styles.verticalButtonContainer}>
              <CustomButton title="Guardar" onPress={() => handleAddContact({name: contactName,email: contactEmail,telephone: contactPhone})} color="blue" />
              <CustomButton title="Cancelar" onPress={() => closeAddContactModal()} color="red" />
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
                value={selectedContactToEdit?.name || ''}
                onChangeText={(text) =>
                  setSelectedContactToEdit((prev) => prev ? { ...prev, name: text } : null)
                }
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Correo electrónico"
                placeholderTextColor="#666"
                keyboardType="email-address"
                value={selectedContactToEdit?.email || ''}
                onChangeText={(text) =>
                  setSelectedContactToEdit((prev) => prev ? { ...prev, email: text } : null)
                }
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Teléfono"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
                value={selectedContactToEdit?.telephone || ''}
                maxLength={11}
                onChangeText={(text) => {
                  const numericText = text.replace(/\D/g, ""); // Elimina todo lo que no es número
                  const formattedText = numericText.replace(/(\d{3})/g, "$1 ").trim(); // Agrupa en bloques de 3
                  setSelectedContactToEdit((prev) =>
                    prev ? { ...prev, telephone: formattedText } : null
                  );
                }}
                
              />

            <View style={styles.verticalButtonContainer}>
              <CustomButton title="Guardar cambios" onPress={() => handleEditContact({ name: selectedContactToEdit?.name || "", email: selectedContactToEdit?.email || "", telephone: selectedContactToEdit?.telephone || ""})} color="blue"/>
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
    marginBottom: 10,
  },  
  tableScrollContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  tableScrollContent: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  tableWrapper: {
    alignSelf: 'center',
    minWidth: '80%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: GlobalStyles.blue,
    paddingHorizontal: 5,
    borderRadius: 8,
    minHeight: 50,
    alignItems: 'center',
  },
  headerCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    minWidth: 220,
    fontWeight: 'bold',
    color: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    minHeight: 50,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 200,
    alignItems: 'center',
    paddingVertical: 10,
  },
  cellText: {
    textAlign: 'center',
    fontSize: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  actionsButton: {
    alignSelf: 'center',
    width: 100,
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
