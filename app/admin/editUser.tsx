import CustomButton from '@/components/CustomButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, TextInput, View, StyleSheet, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';
import { BACKEND_API } from '@/constants/Mysc';


function EditUserScreen() {
  interface Profile {
    fullName: string;
    password: string;
    email: string;
    telephone: string;
    address?: string;
    city?: string;
    zipCode?: string;
    nif?: string;
    description?: string;
  }

  const route = useRoute();
  const { userId, isCustomer } = route.params as { userId: string; isCustomer: boolean };
  const [editedProfile, setEditedProfile] = useState<Profile>({
    fullName: '',
    email: '',
    telephone: '',
    address: '',
    city: '',
    zipCode: '',
    nif: '',
    description: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          throw new Error('No se encontró el token de autenticación.');
        }

        const endpoint = isCustomer
          ? BACKEND_API + `/api/auth/admin/customers/${userId}`
          : BACKEND_API + `/api/auth/admin/companies/${userId}`;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo obtener los datos del perfil.`);
        }

        const data = await response.json();
        setEditedProfile(data);
      } catch (error: any) {
        console.error('Error al obtener el perfil:', error.message);
        showAlert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, isCustomer]);

  const handleInputChange = (field: keyof Profile, value: string) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('No se encontró el token de autenticación.');
      }
      const endpoint = isCustomer
        ? BACKEND_API + `/api/auth/admin/customers/${userId}`
        : BACKEND_API + `/api/auth/admin/companies/${userId}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedProfile),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo actualizar el perfil.`);
      }

      showAlert('Éxito', 'Perfil actualizado correctamente.');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error al guardar los cambios:', error.message);
      showAlert('Error', error.message);
    }
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const renderEditableField = (
    label: string,
    value: string,
    field: keyof Profile,
    placeholder: string,
    secureTextEntry?: boolean
  ) => (
    <View key={field} style={styles.inputContainer}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        style={styles.input}
        value={value ?? ''}
        onChangeText={(text) => handleInputChange(field, text)}
        placeholder={placeholder}
        placeholderTextColor={'#666'}
        editable={isEditing}
        secureTextEntry={secureTextEntry} // Oculta la contraseña con puntitos
      />
    </View>
  );

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          <ThemedText style={styles.title}>{isCustomer ? 'Editar Cliente' : 'Editar Empresa'}</ThemedText>

          {isCustomer ? (
            <View style={styles.formContainer}>
              {renderEditableField('Nombre', editedProfile.fullName, 'fullName', 'Nombre')}
              {renderEditableField('Email', editedProfile.email, 'email', 'Correo electrónico')}
              {renderEditableField('Teléfono', editedProfile.telephone, 'telephone', 'Teléfono')}
            </View>
          ) : (
            <View style={styles.twoColumnsContainer}>
              <View style={styles.column}>
                {renderEditableField('Nombre', editedProfile.fullName, 'fullName', 'Nombre')}
                {renderEditableField('Email', editedProfile.email, 'email', 'Email')}
                {renderEditableField('NIF', editedProfile.nif ?? '', 'nif', 'NIF')}
                {renderEditableField('Descripción', editedProfile.description ?? '', 'description', 'Descripción')}
              </View>
              <View style={styles.column}>
                {renderEditableField('Contraseña', editedProfile.password, 'password', 'Contraseña', true)}
                {renderEditableField('Dirección', editedProfile.address ?? '', 'address', 'Dirección')}
                {renderEditableField('Ciudad', editedProfile.city ?? '', 'city', 'Ciudad')}
                {renderEditableField('Código Postal', editedProfile.zipCode ?? '', 'zipCode', 'Código Postal')}
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            {isEditing ? (
              <CustomButton title="Guardar" onPress={handleSave} color="blue" />
            ) : (
              <CustomButton title="Editar" onPress={() => setIsEditing(true)} color="blue" />
            )}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  twoColumnsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
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

export default withAuth(EditUserScreen, [AUTHORITIES.ADMIN]);
