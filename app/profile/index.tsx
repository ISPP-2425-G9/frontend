import CustomButton from '@/components/CustomButton';
import DeleteAccountButton from '@/components/DeleteAccountButton';
import LogoutButton from '@/components/LogoutButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GlobalStyles } from '@/constants/Colors';
import { BACKEND_API } from '@/constants/Mysc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AUTHORITIES } from '../_util/Authorities';
import { withAuth } from '../_util/withAuth';


function ProfileScreen() {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<CustomerProfile>({
    name: "",
    email: "",
    telephone: "",
    password: "",
  });
  const [editedCompany, setEditedCompany] = useState<CompanyProfile>({
    name: "",
    email: "",
    telephone: "",
    address: "",
    city: "",
    zipCode: "",
    nif: "",
    description: "",
    imageUrl: "",
    password: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');


  const fetchProfile = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem("user_data");
      if (!userDataStr) {
        console.error("Faltan datos de autenticación");
        setLoading(false);
        return;
      }
      const userData = JSON.parse(userDataStr);
      const token = userData.token;
      const userId = userData.id;
      const userRole = userData.roles[0];

      if (!token || !userId || !userRole) {
        console.error("Faltan datos de autenticación");
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
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Error al obtener los datos del perfil");
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
      console.error("Error al cargar el perfil:", error);
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

  const handleInputChangeCompany = (
    field: keyof CompanyProfile,
    value: string
  ) => {
    setEditedCompany({ ...editedCompany, [field]: value });
  };

  const handleSave = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem("user_data");
      if (!userDataStr) {
        console.error("Faltan datos de autenticación");
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
        telephone: editedCustomer.telephone,
        password: editedCustomer.password,
      };

      const response = await fetch(
        BACKEND_API + `/api/auth/customers/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (Platform.OS === "web") {
          window.alert("Error al actualizar el perfil, comprueba los datos");
        } else {
          Alert.alert("Error al actualizar el perfil, comprueba los datos");
        }
        throw new Error(errorData.message || "Error al actualizar el perfil");
      }

      const data = await response.json();

      await AsyncStorage.setItem(
        "user_data",
        JSON.stringify({
          ...userData,
          email: editedCustomer.email,
          token: data.token || userData.token,
        })
      );

      fetchProfile();
      setIsEditing(false);
      Alert.alert("Éxito", "Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  const handleSaveCompany = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem("user_data");
      if (!userDataStr) {
        console.error("Faltan datos de autenticación");
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
        telephone: editedCompany.telephone,
        password: editedCompany.password,
        address: editedCompany.address,
        city: editedCompany.city,
        zipCode: editedCompany.zipCode,
        nif: editedCompany.nif,
        description: editedCompany.description,
        imageUrl: editedCompany.imageUrl,
      };

      const response = await fetch(
        BACKEND_API + `/api/auth/companies/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (Platform.OS === "web") {
          window.alert("Error al actualizar el perfil, comprueba los datos");
        } else {
          Alert.alert("Error al actualizar el perfil, comprueba los datos");
        }
        throw new Error(errorData.message || "Error al actualizar el perfil");
      }

      const data = await response.json();

      await AsyncStorage.setItem(
        "user_data",
        JSON.stringify({
          ...userData,
          email: editedCustomer.email,
          token: data.token || userData.token,
        })
      );

      fetchProfile();
      setIsEditing(false);
      Alert.alert("Éxito", "Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  const handleUpdateImageUrl = () => {
    if (customImageUrl.trim()) {
      setEditedCompany({ ...editedCompany, imageUrl: customImageUrl.trim() });
      setCustomImageUrl("");
    } else {
      Alert.alert("Error", "Por favor ingresa un URL válido");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      const userDataStr = await AsyncStorage.getItem("user_data");
      if (!userDataStr) {
        Alert.alert("Error", "No hay datos de autenticación");
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
        Alert.alert(
          "Error",
          errorData || "Error mientras se actualizaba la contraseña"
        );
        return;
      }

      const data = await response.json();

      await AsyncStorage.setItem('user_data', JSON.stringify({
        ...userData,
        token: data.token || userData.token,
      }));

      Alert.alert('Éxito', 'Contraseña actualizada correctamente');
      setShowPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      Alert.alert("Error", errorMessage);
    }
  };

  const renderEditableField = (
    label: string,
    value: string,
    field: keyof CustomerProfile,
    placeholder: string
  ) => (
    <>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => handleInputChange(field, text)}
          placeholder={placeholder}
          placeholderTextColor={"#666"}
        />
      ) : (
        <ThemedText style={styles.value}>{value}</ThemedText>
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
      <ThemedText style={styles.labelCompany}>{label}</ThemedText>
      {isEditing ? (
        <TextInput
          style={
            field === "description"
              ? styles.inputCompanyDescription
              : styles.inputCompany
          }
          value={value}
          onChangeText={(text) => handleInputChangeCompany(field, text)}
          placeholder={placeholder}
          placeholderTextColor={"#666"}
          multiline={field === "description"}
        />
      ) : (
        <ThemedText
          style={
            field === "name"
              ? styles.valueName
              : field === "description"
              ? styles.valueDescription
              : styles.valueCompany
          }
        >
          {value}
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
    <ThemedView style={styles.container}>
      {customer || company ? (
        <>
          <View style={styles.profileContainer}>
            {role === "CUSTOMER" ? (
              <View style={styles.columnData}>
                <ThemedText style={styles.title}>Mis datos</ThemedText>
                {renderEditableField('Nombre', editedCustomer.name, 'name', 'Nombre de usuario')}
                {renderEditableField('Email', editedCustomer.email, 'email', 'Email')}
                {renderEditableField('Teléfono', editedCustomer.telephone, 'telephone', 'Número de teléfono')}
                <ThemedText style={styles.label}>DNI</ThemedText>
                <ThemedText style={styles.value}>{editedCustomer.dni}</ThemedText>
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
                      onPress={() => {setIsEditing(true)}}
                      color="blue"
                    />
                    <LogoutButton />
                  </View>
                )}

                <ThemedText style={styles.changePasswordText}>
                  ¿Desea cambiar su contraseña?{' '}
                  <Pressable onPress={() => {setShowPasswordModal(true)}}>
                    <ThemedText style={styles.changePasswordLink}>Cambiar contraseña</ThemedText>
                  </Pressable>
                </ThemedText>
              </View>
            ) : (
              <View style={styles.companyContainer}>
                <View style={styles.companyHeader}>
                  {renderEditableFieldCompany(
                    "",
                    editedCompany.name,
                    "name",
                    "Name"
                  )}
                  {isEditing ? (
                    <View style={styles.imageHeaderContainer}>
                      <Image
                        source={{
                          uri:
                            editedCompany.imageUrl ||
                            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/925px-Unknown_person.jpg",
                        }}
                        style={styles.companyImage}
                      />
                      <TextInput
                        style={styles.inputImage}
                        value={customImageUrl}
                        onChangeText={setCustomImageUrl}
                        placeholder="Ingresa URL de imagen"
                        placeholderTextColor="#666"
                      />
                      <CustomButton
                        title="Actualizar imagen"
                        onPress={handleUpdateImageUrl}
                        color="blue"
                      />
                    </View>
                  ) : (
                    <Image
                      source={{
                        uri:
                          editedCompany.imageUrl ||
                          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/925px-Unknown_person.jpg",
                      }}
                      style={styles.companyImage}
                    />
                  )}
                </View>

                <View style={styles.twoColumnsContainerCompany}>
                  <View style={styles.column}>
                    {renderEditableFieldCompany(
                      "Descripción",
                      editedCompany.description,
                      "description",
                      "Descripción"
                    )}
                    {renderEditableFieldCompany(
                      "Email",
                      editedCompany.email,
                      "email",
                      "Email"
                    )}
                    {renderEditableFieldCompany(
                      "Teléfono",
                      editedCompany.telephone,
                      "telephone",
                      "Teléfono"
                    )}
                  </View>
                  <View style={styles.column}>
                    <ThemedText style={styles.labelCompany}>NIF</ThemedText>
                    <ThemedText style={styles.valueCompany}>
                      {editedCompany.nif}
                    </ThemedText>
                    {renderEditableFieldCompany(
                      "Dirección",
                      editedCompany.address,
                      "address",
                      "Dirección"
                    )}
                    {renderEditableFieldCompany(
                      "Ciudad",
                      editedCompany.city,
                      "city",
                      "Ciudad"
                    )}
                    {renderEditableFieldCompany(
                      "Código Postal",
                      editedCompany.zipCode,
                      "zipCode",
                      "Código Postal"
                    )}
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
                  <View>
                    <View style={styles.buttonContainer}>
                      <CustomButton
                        title="Editar información"
                        onPress={() => {setIsEditing(true)}}
                        color="blue"
                      />
                      <LogoutButton />
                    </View>
                    <ThemedText style={styles.changePasswordText}>
                      ¿Desea cambiar su contraseña?{' '}
                      <Pressable onPress={() => {setShowPasswordModal(true)}}>
                        <ThemedText style={styles.changePasswordLink}>Cambiar contraseña</ThemedText>
                      </Pressable>
                    </ThemedText>
                  </View>
                )}
              </View>
            )}
          </View>

          <Modal visible={showPasswordModal} transparent animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ThemedText style={styles.modalTitle}>
                  Cambiar contraseña
                </ThemedText>
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
                <CustomButton title="Cancelar" onPress={() => {setShowPasswordModal(false)}} color="red" />
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <ThemedText style={styles.text}>
          No se pudo cargar el perfil.
        </ThemedText>
      )}
    </ThemedView>
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
    padding: 20,
    elevation: 5,
    width: "95%",
    height: "80%",
    alignItems: "center",
  },
  companyContainer: {
    paddingTop: 120,
    padding: 20,
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  twoColumnsContainerCompany: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
  },
  columnData: {
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
    height: '100%',
  },
  column: {
    width: "50%",
    height: "100%",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
    textAlign: 'left',
    width: '100%',
    marginLeft: '15%',
  },
  labelCompany: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
    textAlign: "left",
    width: "70%",
  },
  value: {
    fontSize: 18,
    color: "#000",
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '100%',
    marginLeft: '15%',
  },
  valueCompany: {
    fontSize: 18,
    color: "#000",
    marginBottom: 15,
    fontWeight: "bold",
    textAlign: "left",
    width: "70%",
  },
  valueName: {
    fontSize: 24,
    color: "#000",
    marginBottom: 15,
    fontWeight: "bold",
    textAlign: "left",
    width: "40%",
  },
  imageHeaderContainer: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    width: "100%",
  },
  input: {
    width: '90%',
    backgroundColor: GlobalStyles.lightGrey,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  inputImage: {
    width: '50%',
    alignSelf: 'center',
    backgroundColor: GlobalStyles.lightGrey,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  inputCompany: {
    width: '70%',
    backgroundColor: GlobalStyles.lightGrey,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  inputCompanyDescription: {
    width: '70%',
    height: '50%',
    backgroundColor: GlobalStyles.lightGrey,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  valueDescription: {
    fontSize: 18,
    height: "50%",
    color: "#000",
    marginBottom: 15,
    fontWeight: "bold",
    textAlign: "left",
    width: "70%",
  },
  text: {
    fontSize: 18,
    color: "#000",
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  changePasswordLink: {
    color: "#42B5FC",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  companyHeader: {
    width: "60%",
    flexDirection: "column",
    alignItems: "flex-start",
    alignContent: "center",
    marginBottom: 20,
  },
  companyImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    width: 'auto',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    gap: 10,
  },
  modalTitle: {
    color: "#000",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default withAuth(ProfileScreen, [
  AUTHORITIES.CUSTOMER,
  AUTHORITIES.COMPANY,
]);
