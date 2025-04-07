import CustomButton from '@/components/CustomButton';
import CustomModal, { CustomModalRef } from '@/components/CustomModal';
import CustomTextInput from '@/components/CustomTextInput';
import DeleteAccountButton from '@/components/DeleteAccountButton';
import LogoutButton from '@/components/LogoutButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GlobalStyles } from '@/constants/Colors';
import { BACKEND_API } from '@/constants/Mysc';
import { useNotification } from '@/context/NotificationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AUTHORITIES } from '../_util/Authorities';
import { withAuth } from '../_util/withAuth';

const deviceWidth = Dimensions.get("window").width;

function ProfileScreen() {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<CustomerProfile>({ name: '', email: '', telephone: '', password: '' });
  const [editedCompany, setEditedCompany] = useState<CompanyProfile>({ name: '', email: '', telephone: '', address: '', city: '', zipCode: '', nif: '', description: '', imageUrl: '', password: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const { showNotification } = useNotification();
  const formatPhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    const groups = digits.match(/.{1,3}/g);
    return groups ? groups.join(' ') : phone;
  };
  const customModalRef = useRef<CustomModalRef>(null);

  const emailRegex = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\d{9}$/;
  const zipCodeRegex = /^\d{5}$/;

  const isMobile = deviceWidth < 768;

  const removeSpaces = (phone: string): string => phone.replace(/\s/g, '');

  const handlePhoneChange = (text: string, field: keyof CustomerProfile) => {
    const formatted = formatPhone(text);
    handleInputChange(field, formatted);
  };

  const handlePhoneChangeCompany = (text: string, field: keyof CompanyProfile) => {
    const formatted = formatPhone(text);
    handleInputChangeCompany(field, formatted);
  };

  const fetchProfile = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('user_data');
      if (!userDataStr) {
        console.error('Faltan datos de autenticación');
        setLoading(false);
        return;
      }
      const userData = JSON.parse(userDataStr);
      const token = userData.token;
      const userId = userData.id;
      const userRole = userData.roles[0];

      if (!token || !userId || !userRole) {
        console.error('Faltan datos de autenticación');
        setLoading(false);
        return;
      }

      setRole(userRole);

      let endpoint = BACKEND_API + `/api/auth/`;

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

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
      document.title = 'Perfil';
    }, [])
  );

  interface CustomerProfile {
    name: string;
    email: string;
    telephone: string;
    password: string;
    [key: string]: any;
  }

  interface CompanyProfile {
    name: string;
    email: string;
    telephone: string;
    password: string;
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
      const userDataStr = await AsyncStorage.getItem('user_data');
      if (!userDataStr) {
        console.error('Faltan datos de autenticación');
        return;
      }
      const userData = JSON.parse(userDataStr);
      const token = userData.token;
      const userId = userData.id;

      if (!token || !userId) {
        return;
      }

      const updatedData = {
        email: editedCustomer.email,
        fullName: editedCustomer.name,
        telephone: removeSpaces(editedCustomer.telephone),
        password: editedCustomer.password,
      };

      if (editedCustomer.name.length < 1) {
        showNotification({
          message: "El nombre es obligatorio",
          type: "error",
        });
        return;
      }

      if (!emailRegex.test(editedCustomer.email)) {
        showNotification({
          message: "El email no es válido",
          type: "error",
        });
        return;
      }

      if (!phoneRegex.test(removeSpaces(editedCustomer.telephone))) {
        showNotification({
          message: "El teléfono no es válido",
          type: "error",
        });
        return;
      }

      const response = await fetch(BACKEND_API + `/api/auth/customers/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showNotification({
          message: errorData.error || errorData.detail || "Error desconocido",
          type: "error",
        });
        return;
      }

      const data = await response.json();

      await AsyncStorage.setItem('user_data', JSON.stringify({
        ...userData,
        email: editedCustomer.email,
        name: editedCustomer.name,
        token: data.token || userData.token,
      }));

      fetchProfile();
      setIsEditing(false);
      showNotification({
        message: "Perfil actualizado correctamente",
        type: "success",
      });

    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleSaveCompany = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('user_data');
      if (!userDataStr) {
        console.error('Faltan datos de autenticación');
        return;
      }
      const userData = JSON.parse(userDataStr);
      const token = userData.token;
      const userId = userData.id;

      if (!token || !userId) {
        return;
      }

      const updatedData = {
        name: editedCompany.name,
        email: editedCompany.email,
        telephone: removeSpaces(editedCompany.telephone),
        password: editedCompany.password,
        address: editedCompany.address,
        city: editedCompany.city,
        zipCode: editedCompany.zipCode,
        nif: editedCompany.nif,
        description: editedCompany.description,
        imageUrl: editedCompany.imageUrl,
      };

      if (editedCompany.name.length < 1) {
        showNotification({
          message: "El nombre de la empresa es obligatorio",
          type: "error",
        });
        return;
      }

      if (!emailRegex.test(editedCompany.email)) {
        showNotification({
          message: "El email no es válido",
          type: "error",
        });
        return;
      }
      if (!phoneRegex.test(removeSpaces(editedCompany.telephone))) {
        showNotification({
          message: "El teléfono no es válido",
          type: "error",
        });
        return;
      }

      if (!zipCodeRegex.test(removeSpaces(editedCompany.zipCode))) {
        showNotification({
          message: "El código postal no es válido",
          type: "error",
        });
        return;
      }

      if (editedCompany.description.length < 1) {
        showNotification({
          message: "La descripción es obligatoria",
          type: "error",
        });
        return;
      }

      if (editedCompany.city.length < 1) {
        showNotification({
          message: "La ciudad es obligatoria",
          type: "error",
        });
        return;
      }

      if (editedCompany.address.length < 1) {
        showNotification({
          message: "La dirección es obligatoria",
          type: "error",
        });
        return;
      }

      const response = await fetch(BACKEND_API + `/api/auth/companies/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showNotification({
          message: errorData.error || errorData.detail || "Error desconocido",
          type: "error",
        });
        return;
      }

      const data = await response.json();

      await AsyncStorage.setItem('user_data', JSON.stringify({
        ...userData,
        email: editedCustomer.email,
        name: editedCompany.name,
        token: data.token || userData.token,
      }));

      fetchProfile();
      setIsEditing(false);
      showNotification({
        message: "Perfil actualizado correctamente",
        type: "success",
      });
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  }

  const handleUpdateImageUrl = () => {
    if (customImageUrl.trim()) {
      setEditedCompany({ ...editedCompany, imageUrl: customImageUrl.trim() });
      setCustomImageUrl('');
    } else {
      showNotification({
        message: "Por favor ingresa un URL válido",
        type: "error",
      });
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      customModalRef.current?.showNotification({
        message: "Las contraseñas no coinciden",
        type: "error",
        duration: 2000,
      });
      return;
    }

    if (newPassword.length < 6 || confirmPassword.length < 6) {
      customModalRef.current?.showNotification({
        message: "La contraseña debe tener al menos 6 caracteres",
        type: "error",
        duration: 2000,
      });
      return;
    }

    try {
      const userDataStr = await AsyncStorage.getItem('user_data');
      if (!userDataStr) {
        showNotification({
          message: "No hay datos de autenticación",
          type: "error",
        });
        return;
      }
      const userData = JSON.parse(userDataStr);
      const token = userData.token;
      const userId = userData.id;

      const requestBody = {
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      };

      const response = await fetch(`${BACKEND_API}/api/auth/password/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.text();
        Alert.alert('Error', errorData || 'Error mientras se actualizaba la contraseña');
        return;
      }

      const data = await response.json();

      await AsyncStorage.setItem('user_data', JSON.stringify({
        ...userData,
        token: data.token || userData.token,
      }));

      showNotification({
        message: "Contraseña actualizada correctamente",
        type: "success",
      });
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', errorMessage);
    }
  };

  const renderEditableField = (label: string, value: string, field: keyof CustomerProfile, placeholder: string) => (
    <>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {isEditing ? (
        <CustomTextInput
          value={value}
          onChangeText={(text) =>
            field === 'telephone' ? handlePhoneChange(text, field) : handleInputChange(field, text)
          }
          placeholder={placeholder}
          placeholderTextColor={'#666'}
          maxLength={field === 'telephone' ? 11 : 50}
        />
      ) : (
        <ThemedText style={styles.value}>
          {field === 'telephone' ? formatPhone(value) : value}
        </ThemedText>
      )}
    </>
  );

  const renderEditableFieldCompany = (
    label: string,
    value: string,
    field: keyof CompanyProfile,
    placeholder: string
  ) => (
    <>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {isEditing ? (
        <CustomTextInput
          value={value}
          onChangeText={(text) =>
            field === 'telephone'
              ? handlePhoneChangeCompany(text, field)
              : handleInputChangeCompany(field, text)
          }
          placeholder={placeholder}
          placeholderTextColor={'#666'}
          multiline={field === 'description'}
          maxLength={field === 'telephone' ? 11 : field === 'description' ? 500 : 50}
          style={field === 'description' ? { height: 100, width: 300 } : styles.input}
        />
      ) : (
        <ThemedText
          style={
            field === 'name'
              ? styles.valueName
              : field === 'description'
                ? styles.valueDescription
                : styles.value
          }
        >
          {field === 'telephone' ? formatPhone(value) : value}
        </ThemedText>
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
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <ThemedView style={styles.container}>
        {(customer || company) ? (
          <>
            <View style={styles.profileContainer}>
              {role === "CUSTOMER" ? (
                <View style={styles.customerContainer}>
                  <ThemedText style={styles.ThemedText}>Mis datos</ThemedText>
                  <View style={styles.profileData}>
                    {renderEditableField('Nombre', editedCustomer.name, 'name', 'Nombre de usuario')}
                    {renderEditableField('Email', editedCustomer.email, 'email', 'Email')}
                    {renderEditableField('Teléfono', editedCustomer.telephone, 'telephone', 'Número de teléfono')}
                    <ThemedText style={styles.label}>DNI</ThemedText>
                    <ThemedText style={styles.value}>{editedCustomer.dni}</ThemedText>
                  </View>
                  {isEditing ? (
                    <View style={styles.buttonContainer}>
                      <CustomButton
                        title="Guardar"
                        onPress={handleSave}
                        color="blue"
                      />
                    </View>
                  ) : (
                    <View style={styles.buttonContainer}>
                      <CustomButton
                        title="Editar usuario"
                        onPress={() => { setIsEditing(true) }}
                        color="blue"
                      />
                      <LogoutButton />
                      <DeleteAccountButton />
                    </View>
                  )}

                  <ThemedText style={styles.changePasswordText}>
                    ¿Desea cambiar su contraseña?{' '}
                    <Pressable onPress={() => { setShowPasswordModal(true) }}>
                      <ThemedText style={styles.changePasswordLink}>Cambiar contraseña</ThemedText>
                    </Pressable>
                  </ThemedText>
                </View>
              ) : (
                <View style={styles.companyContainer}>
                  <View style={isMobile ? styles.verticalCompanyHeader : styles.companyHeader}>
                    {renderEditableFieldCompany('', editedCompany.name, 'name', 'Name')}
                    {isEditing ?
                      <View style={isMobile ? styles.verticalImageHeaderContainer : styles.imageHeaderContainer}>

                        <Image
                          source={{ uri: editedCompany.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/925px-Unknown_person.jpg' }}
                          style={styles.companyImage}
                        />
                        <CustomTextInput
                          value={customImageUrl}
                          onChangeText={setCustomImageUrl}
                          placeholder="Ingresa URL de imagen"
                          placeholderTextColor="#666"
                          maxLength={200}
                          style={{ width: 300 }}
                        />
                        <CustomButton
                          title="Actualizar imagen"
                          onPress={handleUpdateImageUrl}
                          color="blue"
                        />
                      </View>
                      :
                      <Image
                        source={{ uri: editedCompany.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/925px-Unknown_person.jpg' }}
                        style={styles.companyImage}
                      />}
                  </View>

                  <View style={isMobile ? styles.columnContainerCompany : styles.twoColumnsContainerCompany}>
                    {isMobile ? (
                      <><View style={{ width: '80%' }}>
                        {renderEditableFieldCompany('Descripción', editedCompany.description, 'description', 'Descripción')}
                        {renderEditableFieldCompany('Email', editedCompany.email, 'email', 'Email')}
                        {renderEditableFieldCompany('Teléfono', editedCompany.telephone, 'telephone', 'Teléfono')}
                        <ThemedText style={styles.label}>NIF</ThemedText>
                        <ThemedText style={styles.value}>{editedCompany.nif}</ThemedText>
                        {renderEditableFieldCompany('Dirección', editedCompany.address, 'address', 'Dirección')}
                        {renderEditableFieldCompany('Ciudad', editedCompany.city, 'city', 'Ciudad')}
                        {renderEditableFieldCompany('Código Postal', editedCompany.zipCode, 'zipCode', 'Código Postal')}
                      </View>
                      </>
                    ) : (
                      <>
                        <View style={styles.column}>
                          {renderEditableFieldCompany('Descripción', editedCompany.description, 'description', 'Descripción')}
                          {renderEditableFieldCompany('Email', editedCompany.email, 'email', 'Email')}
                          {renderEditableFieldCompany('Teléfono', editedCompany.telephone, 'telephone', 'Teléfono')}
                        </View>
                        <View style={styles.column}>
                          <ThemedText style={styles.label}>NIF</ThemedText>
                          <ThemedText style={styles.value}>{editedCompany.nif}</ThemedText>
                          {renderEditableFieldCompany('Dirección', editedCompany.address, 'address', 'Dirección')}
                          {renderEditableFieldCompany('Ciudad', editedCompany.city, 'city', 'Ciudad')}
                          {renderEditableFieldCompany('Código Postal', editedCompany.zipCode, 'zipCode', 'Código Postal')}
                        </View>
                      </>
                    )}
                  </View>

                  {isEditing ? (
                    <View style={styles.buttonContainer}>
                      <CustomButton
                        title="Guardar"
                        onPress={handleSaveCompany}
                        color="blue"
                      />
                    </View>
                  ) : (
                    <View>
                      <View style={styles.buttonContainer}>
                        <CustomButton
                          title="Editar información"
                          onPress={() => { setIsEditing(true) }}
                          color="blue"
                        />
                        <LogoutButton />
                        <DeleteAccountButton />
                      </View>
                      <ThemedText style={styles.changePasswordText}>
                        ¿Desea cambiar su contraseña?{' '}
                        <Pressable onPress={() => { setShowPasswordModal(true) }}>
                          <ThemedText style={styles.changePasswordLink}>Cambiar contraseña</ThemedText>
                        </Pressable>
                      </ThemedText>
                    </View>
                  )}
                </View>
              )}
            </View>

            <CustomModal
              ref={customModalRef}
              visible={showPasswordModal}
              onClose={() => { setShowPasswordModal(false) }}
              title="Cambiar contraseña"
              style={styles.modalContent}>
              <View style={styles.modalContent}>
                <CustomTextInput
                  placeholder="Nueva contraseña"
                  placeholderTextColor="#666"
                  secureTextEntry
                  showPasswordToggle={false}
                  value={newPassword}
                  maxLength={36}
                  onChangeText={setNewPassword}
                />
                <CustomTextInput
                  placeholder="Confirmar contraseña"
                  placeholderTextColor="#666"
                  secureTextEntry
                  showPasswordToggle={false}
                  maxLength={36}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />

                <View style={styles.modalButtons}>
                  <CustomButton
                    title="Cancelar"
                    onPress={() => { setShowPasswordModal(false) }}
                    style={StyleSheet.flatten([styles.modalButton, styles.cancelButton])}
                  />
                  <CustomButton
                    title="Guardar"
                    onPress={handleChangePassword}
                    style={StyleSheet.flatten([styles.modalButton, styles.saveButton])}
                  />
                </View>
              </View>
            </CustomModal>
          </>
        ) : (
          <ThemedText style={styles.ThemedText}>No se pudo cargar el perfil.</ThemedText>
        )
        }
      </ThemedView>
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: GlobalStyles.white,
  },
  profileContainer: {
    paddingTop: 20,
    width: '100%',
    height: '100%',
  },
  customerContainer: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '90%',
    maxWidth: 450,
    alignSelf: 'center',
  },
  profileData: {
    marginTop: 20,
    alignSelf: 'center',
  },
  companyContainer: {
    backgroundColor: "#fff",
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingTop: 50,
    elevation: 5,
    marginHorizontal: '5%',
    marginVertical: 10,
    padding: '1%',
    minWidth: '60%',
    maxWidth: 1250,
    width: 'auto',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  twoColumnsContainerCompany: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  columnContainerCompany: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
  },
  column: {
    marginLeft: '5%',
    width: '50%',
    height: '100%',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 16,
    color: GlobalStyles.grey,
    marginBottom: 5,
    textAlign: 'left',
    width: '100%',
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '100%',
  },
  valueName: {
    fontSize: 28,
    marginBottom: 15,
    fontFamily: GlobalStyles.font,
    textAlign: "left",
    color: GlobalStyles.darkGrey,
  },
  imageHeaderContainer: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    width: '100%',
  },
  verticalImageHeaderContainer: {
    marginTop: 20,
    flexDirection: 'column',
    gap: 20,
    alignItems: 'center',
    width: '100%',
  },
  valueDescription: {
    fontSize: 16,
    height: 'auto',
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '70%',
  },
  ThemedText: {
    fontSize: 28,
    fontFamily: GlobalStyles.font,
    textAlign: "center",
    color: GlobalStyles.darkGrey,
    marginTop: 20,
    marginHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    gap: 20,
  },
  changePasswordText: {
    color: GlobalStyles.darkGrey,
    fontFamily: GlobalStyles.font,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  changePasswordLink: {
    color: GlobalStyles.blue,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  input: {
    width: 300,
  },
  companyHeader: {
    width: '80%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignContent: 'center',
    marginBottom: 20,
  },
  verticalCompanyHeader: {
    width: '80%',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  companyImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginVertical: 10,
  },
  modalContent: {
    width: '90%',
    gap: 10,
    maxWidth: 400,
    paddingHorizontal: '2%',
    backgroundColor: GlobalStyles.white,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 16,
  },
  modalButtons: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: GlobalStyles.blue,
  },
  cancelButton: {
    backgroundColor: GlobalStyles.red,
  },
});

export default withAuth(ProfileScreen, [AUTHORITIES.CUSTOMER, AUTHORITIES.COMPANY]);
