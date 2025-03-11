import CustomButton from '@/components/CustomButton';
import DeleteAccountButton from '@/components/DeleteAccountButton';
import LogoutButton from '@/components/LogoutButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

export default function ProfileScreen() {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<CustomerProfile>({ name: '', email: '', telephone: '' });
  const [editedCompany, setEditedCompany] = useState<CompanyProfile>({ name: '', email: '', telephone: '', address: '', city: '', zipCode: '', nif: '', description: '', imageUrl: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

      if (userRole === "CUSTOMER") {
        endpoint += `customers/${userId}`;
      } else if (userRole === "COMPANY") {
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
      if (userRole === "CUSTOMER") {
        setCustomer(data);
        setEditedCustomer(data);
      } else if (userRole === "COMPANY") {
        setCompany(data);
        setEditedCompany(data);
      }
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProfile();
  }, []);

  interface CustomerProfile {
    name: string;
    email: string;
    telephone: string;
    password?: string;
    [key: string]: any;
  }

  interface CompanyProfile {
    name: string;
    email: string;
    telephone: string;
    password?: string;
    address: string;
    city: string;
    zipCode: string;
    nif: string;
    description: string;
    imageUrl: string;
    [key: string]: any;
  }

  const handleInputChange = (field: keyof CustomerProfile, value: string) => {
    setEditedCustomer({ ...editedCustomer, [field]: value });
  };

  const handleInputChangeCompany = (field: keyof CompanyProfile, value: string) => {
    setEditedCompany({ ...editedCompany, [field]: value });
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        return;
      }

      const updatedData = {
        email: editedCustomer.email,
        fullName: editedCustomer.name,
        telephone: editedCustomer.telephone,
        password: editedCustomer.password,
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

      const data = await response.json();
      await AsyncStorage.setItem('userId', data.id);
      await AsyncStorage.setItem('email', data.username);
      await AsyncStorage.setItem('roles', JSON.stringify(data.roles));
      await AsyncStorage.setItem('authToken', data.token);
      await AsyncStorage.setItem('userRole', data.roles[0]);

      fetchProfile();
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleSaveCompany = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        return;
      }

      const updatedData = {
        name: editedCompany.name,
        email: editedCompany.email,
        telephone: editedCompany.telephone,
        password: editedCompany.password,
        address: editedCompany.address,
        city: editedCompany.city,
        zipCode: editedCompany.zipCode,
        nif: editedCompany.nif,
        description: editedCompany.description,
        imageUrl: editedCompany.imageUrl,
      };

      console.log('Datos a enviar:', updatedData);

      const response = await fetch(`http://localhost:8080/api/auth/companies/${userId}`, {
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
      setCompany(updatedProfile);
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  }



  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    //TODO: Lógica para cambiar la contraseña

    Alert.alert('Éxito', 'Contraseña actualizada correctamente');
    setShowPasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const renderEditableField = (label: string, value: string, field: keyof CustomerProfile, placeholder: string) => (
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

  const renderEditableFieldCompany = (label: string, value: string, field: keyof CompanyProfile, placeholder: string) => (
    <>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {isEditing ? (
        <TextInput
          style={styles.inputCompany}
          value={value}
          onChangeText={(text) => handleInputChangeCompany(field, text)}
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
      {(customer || company) ? (
        <>
          <View style={styles.profileContainer}>
            {role === "CUSTOMER" ? (
              <View style={styles.twoColumnsContainer}>
                <View style={styles.column}>
                  <ThemedText style={styles.title}>Mis Datos</ThemedText>

                  {renderEditableField('Nombre', editedCustomer.name, 'name', 'Nombre de usuario')}
                  {renderEditableField('Email', editedCustomer.email, 'email', 'Email')}
                  {renderEditableField('Teléfono', editedCustomer.telephone, 'telephone', 'Número de teléfono')}

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
                    <Pressable onPress={() => setShowPasswordModal(true)}>
                      <ThemedText style={styles.changePasswordLink}>Cambiar contraseña</ThemedText>
                    </Pressable>
                  </ThemedText>
                </View>

                <View style={styles.column}>
                  <ThemedText style={styles.title}>Contactos de Emergencia</ThemedText>
                  <ThemedText style={styles.label}>Nombre de contacto</ThemedText>
                  <ThemedText style={styles.value}>Juan Pérez</ThemedText>
                  <ThemedText style={styles.label}>Teléfono de contacto</ThemedText>
                  <ThemedText style={styles.value}>123-456-789</ThemedText>
                  <ThemedText style={styles.label}>Email de contacto</ThemedText>
                  <ThemedText style={styles.value}>juanperes@hotmail.es</ThemedText>
                  <View style={styles.buttonContainer}>
                    <CustomButton
                      title="Añadir"
                      onPress={() => console.log("Añadir contacto")}
                      color="blue"
                    />
                    <CustomButton
                      title="Eliminar"
                      onPress={() => console.log("Eliminar contacto")}
                      color="red"
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.companyContainer}>
                <ThemedText style={styles.title}>Información de la Compañía</ThemedText>
                <View style={styles.companyHeader}>
                  <Image
                    source={{ uri: customer.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/925px-Unknown_person.jpg' }}
                    style={styles.companyImage}
                  />
                  <ThemedText style={styles.companyName}>{customer.name || customer.companyName}</ThemedText>
                </View>

                <View style={styles.twoColumnsContainerCompany}>
                  <View style={styles.column}>
                    {renderEditableFieldCompany('Email', customer.email, 'email', 'Email')}
                    {renderEditableFieldCompany('Teléfono', customer.telephone, 'telephone', 'Teléfono')}
                    {renderEditableFieldCompany('NIF', customer.nif, 'nif', 'NIF')}
                    {renderEditableFieldCompany('Descripción', customer.description, 'description', 'Descripción')}
                  </View>
                  <View style={styles.column}>
                    {renderEditableFieldCompany('Dirección', customer.address, 'address', 'Dirección')}
                    {renderEditableFieldCompany('Ciudad', customer.city, 'city', 'Ciudad')}
                    {renderEditableFieldCompany('Código Postal', customer.zipCode, 'zipCode', 'Código Postal')}
                  </View>
                </View>

                {isEditing ? (
                  <View style={styles.buttonContainer}>
                    <CustomButton
                      title="Guardar"
                      onPress={handleSaveCompany}
                      color="blue"
                    />
                    <DeleteAccountButton />
                  </View>
                ) : (
                  <View style={styles.buttonContainer}>
                    <CustomButton
                      title="Editar información"
                      onPress={() => setIsEditing(true)}
                      color="blue"
                    />
                    <LogoutButton />
                  </View>
                )}
              </View>
            )}
          </View>

          <Modal visible={showPasswordModal} transparent animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ThemedText style={styles.modalTitle}>Cambiar Contraseña</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Nueva contraseña"
                  placeholderTextColor="#666"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar contraseña"
                  placeholderTextColor="#666"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <CustomButton title="Guardar" onPress={handleChangePassword} color="blue" />
                <CustomButton title="Cancelar" onPress={() => setShowPasswordModal(false)} color="red" />
              </View>
            </View>
          </Modal>
        </>
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
    padding: 20,
    elevation: 5,
    width: '95%',
    height: '80%',
    alignItems: 'center',
  },
  companyContainer: {
    padding: 20,
    elevation: 5,
    width: '70%',
    height: '80%',
    alignItems: 'center',
  },
  twoColumnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: '15%',
    width: '100%',
  },
  twoColumnsContainerCompany: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: '15%',
    width: '100%',
  },
  column: {
    width: '60%',
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
    marginBottom: 10,
  },
  inputCompany: {
    width: '80%',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
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
  modalContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '40%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    color: '#000',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});