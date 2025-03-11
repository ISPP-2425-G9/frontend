import CustomButton from '@/components/CustomButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TextInput, View, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

interface Profile {
  name: string;
  email: string;
  telephone: string;
  address?: string;
  city?: string;
  zipCode?: string;
  nif?: string;
  description?: string;
}

export default function AdminEditUserScreen() {
  const route = useRoute();
  const { isCustomer } = (route.params as { isCustomer?: boolean }) || { isCustomer: true };

  const [editedProfile, setEditedProfile] = useState<Profile>({
    name: '',
    email: '',
    telephone: '',
    address: '',
    city: '',
    zipCode: '',
    nif: '',
    description: '',
  });

  useEffect(() => {
    setEditedProfile(
      isCustomer
        ? {
            name: 'Cliente Ejemplo',
            email: 'cliente@example.com',
            telephone: '123456789',
          }
        : {
            name: 'Empresa Ejemplo',
            email: 'empresa@example.com',
            telephone: '987654321',
            address: 'Calle Falsa 123',
            city: 'Madrid',
            zipCode: '28001',
            nif: 'B12345678',
            description: 'Empresa líder en el sector.',
          }
    );
  }, [isCustomer]);

  const handleInputChange = (field: keyof Profile, value: string) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const handleSave = () => {
    console.log('✅ Datos guardados:', editedProfile);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          <ThemedText style={styles.title}>{isCustomer ? 'Editar Cliente' : 'Editar Empresa'}</ThemedText>

          {!isCustomer && (
            <View style={styles.companyHeader}>
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/925px-Unknown_person.jpg' }}
                style={styles.companyImage}
              />
              <ThemedText style={styles.companyName}>{editedProfile.name}</ThemedText>
            </View>
          )}

          <View style={isCustomer ? styles.formContainer : styles.twoColumnsContainerCompany}>
            {isCustomer ? (
              <>
                {renderEditableField('Nombre', editedProfile.name, 'name', 'Nombre de usuario', handleInputChange)}
                {renderEditableField('Email', editedProfile.email, 'email', 'Email', handleInputChange)}
                {renderEditableField('Teléfono', editedProfile.telephone, 'telephone', 'Número de teléfono', handleInputChange)}
              </>
            ) : (
              <>
                <View style={styles.column}>
                  {renderEditableField('Email', editedProfile.email, 'email', 'Email', handleInputChange)}
                  {renderEditableField('NIF', editedProfile.nif || '', 'nif', 'NIF', handleInputChange)}
                  {renderEditableField('Descripción', editedProfile.description || '', 'description', 'Descripción', handleInputChange)}
                </View>
                <View style={styles.column}>
                  {renderEditableField('Dirección', editedProfile.address || '', 'address', 'Dirección', handleInputChange)}
                  {renderEditableField('Ciudad', editedProfile.city || '', 'city', 'Ciudad', handleInputChange)}
                  {renderEditableField('Código Postal', editedProfile.zipCode || '', 'zipCode', 'Código Postal', handleInputChange)}
                </View>
              </>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton title="Guardar" onPress={handleSave} color="blue" />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const renderEditableField = (
  label: string,
  value: string,
  field: keyof Profile,
  placeholder: string,
  handleInputChange: (field: keyof Profile, value: string) => void
) => (
  <View style={styles.inputContainer} key={field}>
    <ThemedText style={styles.label}>{label}</ThemedText>
    <TextInput style={styles.input} value={value ?? ''} onChangeText={(text) => handleInputChange(field, text)} placeholder={placeholder} placeholderTextColor={'#666'} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    width: '90%',
    maxWidth: 500,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  twoColumnsContainerCompany: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  column: {
    width: '48%',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
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
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 20,
  },
  companyImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  companyName: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
});

