import React, { useState } from 'react';
import { View, Text, Alert, FlatList, StyleSheet } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { CustomTextInput } from '@/components/CustomTextInput';

type Contact = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

export default function ContactForm() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: '', phone: '', email: '' },
  ]);

  const handleChange = (id: number, field: keyof Contact, value: string) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );
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

  const handleSubmit = async () => {
    if (contacts.some((contact) => !contact.name || !contact.phone || !contact.email)) {
      Alert.alert('Error', 'Todos los campos son obligatorios en cada contacto.');
      return;
    }
    try {
      const response = await fetch('https://tu-backend.com/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contacts),
      });
      await response.json();
      Alert.alert('Éxito', 'Contactos guardados con éxito');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los contactos');
    }
  };

  return (
    <View style={styles.container}>
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
            />
            <CustomTextInput
              placeholder="Teléfono"
              value={item.phone}
              keyboardType="phone-pad"
              onChangeText={(text) => handleChange(item.id, 'phone', text)}
            />
            <CustomTextInput
              placeholder="Email"
              value={item.email}
              keyboardType="email-address"
              onChangeText={(text) => handleChange(item.id, 'email', text)}
            />
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

      <View style={styles.buttonContainer}>
        <CustomButton title="+" onPress={addContact} />
        <CustomButton title="Guardar" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {	
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
   contactContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    paddingBottom: 10,
    flexDirection: 'row',  
    alignItems: 'stretch', 
    width: '100%',  
  },
  deleteButton: {
    marginLeft: 10,
    alignSelf: 'center',  
    width: '5%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
