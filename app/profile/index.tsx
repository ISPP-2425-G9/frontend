import CustomButton from '@/components/CustomButton';
import DeleteAccountButton from '@/components/DeleteAccountButton';
import LogoutButton from '@/components/LogoutButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Pressable, StyleSheet, TextInput, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile>({ name: '', email: '', telephone: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const userId = await AsyncStorage.getItem('userId');
        const userRole = await AsyncStorage.getItem('userRole');

        if (!token || !userId || !userRole) {
          console.error('Faltan datos de autenticación');
          setLoading(false);
          return;
        }

        setRole(userRole);

        let endpoint = 'http://localhost:8080/api/auth/';

        if (userRole == "CUSTOMER") {
          endpoint += `customers/${userId}`;
        } else if (userRole == "COMPANY") {
          endpoint += `companies/${userId}`;
        } else {
          setLoading(false);
          return;
        }

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Error al obtener los datos del perfil');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setProfile(data);
        setEditedProfile(data);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  interface Profile {
    name: string;
    email: string;
    telephone: string;
    password?: string;
    [key: string]: any;
  }

  const handleInputChange = (field: keyof Profile, value: string) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        return;
      }

      const updatedData = {
        email: editedProfile.email,
        fullName: editedProfile.name,
        telephone: editedProfile.telephone,
        password: editedProfile.password,
      };

      console.log('Datos a enviar:', updatedData);

      const response = await fetch(`http://localhost:8080/api/auth/customers/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      console.log('Respuesta del servidor:', response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el perfil');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const renderEditableField = (label: string, value: string, field: keyof Profile, placeholder: string) => (
    <>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => handleInputChange(field, text)}
          placeholder={placeholder}
          placeholderTextColor={'#666'}
        />
      ) : (
        <ThemedText style={styles.value}>{value}</ThemedText>
      )}
    </>
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
      {profile ? (
        <View style={styles.profileContainer}>
          {role === "CUSTOMER" ? (
            <View style={styles.twoColumnsContainer}>
              <View style={styles.column}>
                <ThemedText style={styles.title}>Mis Datos</ThemedText>

                {renderEditableField('Nombre', editedProfile.name, 'name', 'Nombre de usuario')}
                {renderEditableField('Email', editedProfile.email, 'email', 'Email')}
                {renderEditableField('Teléfono', editedProfile.telephone, 'telephone', 'Número de teléfono')}

                {isEditing ? (
                  <View style={styles.buttonContainer}>
                    <CustomButton
                      title="Guardar"
                      onPress={handleSave}
                      color="blue"
                    />
                    <DeleteAccountButton />
                  </View>
                ) : (
                  <View style={styles.buttonContainer}>
                    <CustomButton
                      title="Editar usuario"
                      onPress={() => setIsEditing(true)}
                      color="blue"
                    />
                    <LogoutButton />
                  </View>
                )}

                <ThemedText style={styles.changePasswordText}>
                  ¿Desea cambiar su contraseña?{' '}
                  <Pressable onPress={() => console.log("Cambiar contraseña")}>
                    <ThemedText style={styles.changePasswordLink}>Cambiar contraseña</ThemedText>
                  </Pressable>
                </ThemedText>
              </View>

              <View style={styles.column}>
                <ThemedText style={styles.title}>Contactos de Emergencia</ThemedText>
                <ThemedText style={styles.text}>Teléfono: 123-456-789</ThemedText>
                <ThemedText style={styles.text}>Email: emergencias@example.com</ThemedText>
              </View>
            </View>
          ) : (
            <View>
              <ThemedText style={styles.text}>Nombre: {profile.name || profile.companyName}</ThemedText>
              <ThemedText style={styles.text}>Email: {profile.email}</ThemedText>
              {profile.address && <ThemedText style={styles.text}>Dirección: {profile.address}</ThemedText>}
              {profile.city && <ThemedText style={styles.text}>Ciudad: {profile.city}</ThemedText>}
              {profile.zipCode && <ThemedText style={styles.text}>Código Postal: {profile.zipCode}</ThemedText>}
              {profile.description && <ThemedText style={styles.text}>Descripción: {profile.description}</ThemedText>}
              {profile.nif && <ThemedText style={styles.text}>NIF: {profile.nif}</ThemedText>}
              {profile.dni && <ThemedText style={styles.text}>DNI: {profile.dni}</ThemedText>}
              {profile.plan && (
                <View>
                  <ThemedText style={styles.text}>Plan ID: {profile.plan.planId}</ThemedText>
                  <ThemedText style={styles.text}>Tipo de Plan: {profile.plan.planType}</ThemedText>
                  <ThemedText style={styles.text}>Fecha de Expiración: {profile.plan.expireDate}</ThemedText>
                </View>
              )}
            </View>
          )}
        </View>
      ) : (
        <ThemedText style={styles.text}>No se pudo cargar el perfil.</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: '5%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  profileContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '95%',
    height: '80%',
    alignItems: 'center',
  },
  twoColumnsContainer: {
    flexDirection: width > height ? 'row' : 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  column: {
    width: width > height ? '50%' : '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    textAlign: 'left',
    width: '50%',
    marginLeft: '15%',
  },
  value: {
    fontSize: 18,
    color: '#000',
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '50%',
    marginLeft: '15%',
  },
  input: {
    width: '40%',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  text: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
    gap: 20,
  },
  changePasswordText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  changePasswordLink: {
    color: '#42B5FC',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});