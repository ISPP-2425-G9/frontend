import React, { useState, useEffect } from 'react';
import { View, Text, Alert, FlatList, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { CustomTextInput } from '@/components/CustomTextInput';
import { useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CustomModal from '@/components/CustomModal';
import { GlobalStyles } from '@/constants/Colors';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  'obituaries/selectContacts': { jsonData: string; is_newObituary: boolean; obituaryId: number };
  'obituaries/listMyObituaries': undefined;
  'obituaries/loadCertificate': { jsonData: string };
};

type SelectContactsRouteProp = RouteProp<RootStackParamList, 'obituaries/selectContacts'>;

type Contact = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

export default function SelectContacts() {
  
  const navigation = useNavigation();
  const route = useRoute<SelectContactsRouteProp>();
  const { jsonData } = route.params;

  const is_newObituary = route.params?.is_newObituary ?? true;
  const obituaryId = route.params?.obituaryId ?? undefined;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([{ id: Date.now(), name: '', phone: '', email: '' }]);
  const [combinedData, setCombinedData] = useState<any>({});

  useEffect(() => {
    if (is_newObituary) {
      setContacts([{ id: Date.now(), name: '', phone: '', email: '' }]);
    } else {
      const fetchContactData = async () => {
        try {
          const authToken = await AsyncStorage.getItem('authToken');
          if (!authToken) throw new Error('No se encontró un token de autenticación');

          const response = await fetch(`http://localhost:8080/api/obituary/receivers/${obituaryId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken.trim()}`,
            },
          });

          if (!response.ok) throw new Error('Error al obtener los datos');

          const contactData = await response.json();

          setContacts(contactData);
        } catch (error) {
          console.error('Error al cargar los contactos:');
        }
      };

      fetchContactData();
    }
  }, [is_newObituary, obituaryId]);


  useEffect(() => {
    const updateData = {
      ...JSON.parse(jsonData),
      contacts,
    };
    setCombinedData(updateData);
  }, [contacts, jsonData]);

  const handleChange = (id: number, field: keyof Contact, value: string) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );
  };

  const validateData = (values: Contact) => {
    const errors: string[] = [];
    const emailRegex = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\+?\d{9,15}$/;

    if (!values.name || values.name.trim() === '') {
      errors.push('El nombre es obligatorio para el contacto');
    }

    if (!values.phone || !phoneRegex.test(values.phone)) {
      errors.push('Por favor, introduce un teléfono válido (sin prefijo)');
    }

    if (!values.email || !emailRegex.test(values.email)) {
      errors.push('El email no es válido.');
    }

    return errors;
  };

  const addContact = () => {
    setContacts([{ id: Date.now(), name: '', phone: '', email: '' }, ...contacts]);
  };

  const removeContact = (id: number) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((contact) => contact.id !== id));
    } else {
      window.alert('Debe haber al menos un contacto.');
    }
  };

  const createObituary = async () => {
    const contactsWithoutIds = contacts.map(({ id, ...rest }) => rest);
    const dataToSend = {
      ...combinedData,
      contacts: contactsWithoutIds,
      isMine: false,
    };

    const url = is_newObituary
      ? 'http://localhost:8080/api/obituary/create'
      : `http://localhost:8080/api/obituary/update/${obituaryId}`;

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      console.log('Token:', authToken);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(dataToSend),
      });

      console.log('Respuesta:', response);

      if (response.ok) {
        navigation.navigate('obituaries/listMyObituaries' as never);
      } else {
        throw new Error('Error en la creación de la esquela');
      }
    } catch (error) {
      window.alert('No se pudo crear la esquela. Por favor, inténtelo de nuevo.');
    }
  };

  const moveToNextScreen = () => {
    navigation.navigate('obituaries/loadCertificate' as never);
  };

  const showConfirmationModal = async (is_mine: boolean) => {
    const errors: string[] = [];
    try {
      for (const contact of contacts) {
        const contactErrors = validateData(contact);
        if (contactErrors.length > 0) {
          errors.push(...contactErrors.slice(0, 3 - errors.length));
        }
      }

      if (errors.length !== 0) {
        throw new Error(`Hay error(es) en su formulario: ${errors.join(', ')}`);
      }

      setModalMessage(
        is_mine
          ? '¿Desea guardar su propia esquela?'
          : '¿Desea crear y enviar una esquela para un ser querido?'
      );
      setModalVisible(true);
    } catch (error: any) {
      if (Platform.OS === 'web') {
        window.alert('Error: ' + error.message);
      } else {
        Alert.alert('Error', error.message || error);
      }
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSubmit = async (is_mine: boolean) => {
    try {
      if (is_mine) {
        await createObituary();
      } else {
        moveToNextScreen();
      }
      setModalVisible(false);
    } catch (error: any) {
      if (Platform.OS === 'web') {
        window.alert('Error: ' + error.message);
      } else {
        Alert.alert('Error', error.message || error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        {is_newObituary ? (
          <Text style={styles.title}>Agrega a tus contactos</Text>
        ) : (
          <Text style={styles.title}>Edita a tus contactos</Text>
        )}

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.contactContainer}>
              <Text style={styles.contactNumber}>{index + 1}.</Text>
              <CustomTextInput
                placeholder="Nombre"
                value={item.name}
                onChangeText={(text) => handleChange(item.id, 'name', text)}
                style={styles.input}
              />
              <CustomTextInput
                placeholder="Teléfono"
                value={item.phone}
                keyboardType="phone-pad"
                onChangeText={(text) => handleChange(item.id, 'phone', text)}
                style={styles.input}
              />
              <CustomTextInput
                placeholder="Email"
                value={item.email}
                keyboardType="email-address"
                onChangeText={(text) => handleChange(item.id, 'email', text)}
                style={styles.input}
              />

              {index === 0 && (
                <CustomButton title="Añadir otro" onPress={addContact} style={styles.deleteButton} />
              )}

              {index !== 0 && (
                <CustomButton
                  title="Eliminar"
                  color="red"
                  onPress={() => removeContact(item.id)}
                  style={styles.deleteButton}
                />
              )}
            </View>
          )}
        />
      </View>

      <View style={styles.divider} />
      <View style={styles.buttonContainer}>
        <CustomButton
          title={is_newObituary ? 'Cree su propia esquela' : 'Actualice su propia esquela'}
          onPress={() => showConfirmationModal(true)}
          style={styles.saveButton}
        />
        <CustomButton
          title="Cree y envie su esquela para un ser querido"
          onPress={() => showConfirmationModal(false)}
          style={styles.saveButton}
        />
      </View>

      {modalVisible && (
        <CustomModal visible={modalVisible} onClose={handleCloseModal} title={modalMessage} style={styles.modalStyle}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleSubmit(true)}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleCloseModal()}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dataContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 120,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactNumber: {
    marginRight: 8,
    fontWeight: 'bold',
    fontSize: 20,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    flex: 1,
 
  },
  deleteButton: {
    marginLeft: 10,
    alignSelf: 'center',
    width: '20%',
  },
  input: {
    marginLeft: 10,
    width: '30%',
  },
  saveButton: {
    width: '60%',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1%',
    flexDirection: 'row',
    width: '35%',
    gap: '2%',
  },
  modalStyle: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: width > 600 ? '40%' : '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: GlobalStyles.blue,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
  },
});

