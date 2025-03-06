import React, { useState, useEffect } from 'react';
import { View, Text, Alert, FlatList, StyleSheet } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { CustomTextInput } from '@/components/CustomTextInput';
import { useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  'obituaries/selectContacts': { jsonData: string };
};

type SelectContactsRouteProp = RouteProp<RootStackParamList, 'obituaries/selectContacts'>;

type Contact = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

export default function SelectContacts() {
  const route = useRoute<SelectContactsRouteProp>();
  const { jsonData } = route.params;

  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: '', phone: '', email: '' },
  ]);

  const [combinedData, setCombinedData] = useState<any>({});

  useEffect(() => {
    const updateData = {
      ...JSON.parse(jsonData),
      contacts,
    };
    setCombinedData(updateData);
    console.log("Primer json" + jsonData);
    console.log("Segundo json" + JSON.stringify(updateData, null, 2));

    console.log('Datos combinados:', combinedData);
  }, [contacts, jsonData]);

  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;
    return nameRegex.test(name);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{9,9}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleChange = (id: number, field: keyof Contact, value: string) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );
    let isValid = true;

    if (field === 'name') {
      isValid = validateName(value);
      if (!isValid) Alert.alert('Error', 'El nombre debe tener al menos 2 caracteres y solo letras.');
    }

    if (field === 'phone') {
      isValid = validatePhone(value);
      if (!isValid) Alert.alert('Error', 'El teléfono debe tener al menos 9 dígitos numéricos.');
    }

    if (field === 'email') {
      isValid = validateEmail(value);
      if (!isValid) Alert.alert('Error', 'Por favor, introduce un correo válido.');
    }
  };

  const addContact = () => {
    setContacts([...contacts, { id: Date.now(), name: '', phone: '', email: '' }]);
  };

  const removeContact = (id: number) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((contact) => contact.id !== id));
    } else {
      Alert.alert('Aviso', 'Debe haber al menos un contacto.');
    }
  };

  const handleSubmit = async (is_mine: boolean) => {
    if (contacts.some((contact) => !validateName(contact.name) || !validatePhone(contact.phone) || !validateEmail(contact.email))) {
      Alert.alert('Error', 'Por favor, verifica que todos los contactos tengan datos válidos.');
      return;
    }

    const dataToSend = {
      ...combinedData,
      isMine: is_mine,
    };

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const header_data = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken?.trim()}`,
      };
      const response = await fetch('http://localhost:8080/api/obituary/create', {
        method: 'POST',
        headers: header_data,
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Contactos guardados con éxito');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los contactos');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <Text style={styles.title}>Agrega a tus contactos</Text>

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.contactContainer}>
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

        <View style={styles.saveButtonContainer}>
          <CustomButton
            title="Guardar esquela"
            onPress={() => handleSubmit(true)}
            style={styles.saveButton}
          />
          <CustomButton
            title="Enviar esquela"
            onPress={() => handleSubmit(false)}
            style={styles.saveButton}
          />
        </View>
      </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
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
  saveButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  saveButton: {
    width: '60%',
  },
});