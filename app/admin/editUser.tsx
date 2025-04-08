import CustomButton from '@/components/CustomButton';
import CustomTextInput from '@/components/CustomTextInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GlobalStyles } from '@/constants/Colors';
import { BACKEND_API } from '@/constants/Mysc';
import { useNotification } from '@/context/NotificationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { AUTHORITIES } from '../_util/Authorities';
import { withAuth } from '../_util/withAuth';



function EditUserScreen() {
  interface Profile {
    name: string;
    fullName: string;
    password: string;
    email: string;
    telephone: string;
    address?: string;
    city?: string;
    zipCode?: string;
    nif?: string;
    description?: string;
    dni?: string;
    plan: {
      billingAddress?: string | null;
      expireDate?: string | null;
      id: number;
      planType: string;
    };
  }
  // Definir el tipo de los parámetros esperados
  interface RouteParams {
    userId?: string;
    isCustomer?: boolean;
  };
  const [selectedPlan, setSelectedPlan] = useState<string>('FREE');
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams | undefined;
  const userId = params?.userId ?? '';
  const isCustomer = params?.isCustomer ?? false;

  const { showNotification } = useNotification();

  const [originalProfile, setOriginalProfile] = useState<Profile | null>(null);
  const [editedProfile, setEditedProfile] = useState<Profile>({
    name: '',
    fullName: '',
    email: '',
    telephone: '',
    address: '',
    city: '',
    zipCode: '',
    nif: '',
    description: '',
    dni: '',
    password: '',
    plan: { id: 1, planType: 'FREE' },
  });

  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No se encontró el token de autenticación.');

      const endpoint = isCustomer
        ? `${BACKEND_API}/api/auth/admin/customers/${userId}`
        : `${BACKEND_API}/api/auth/admin/companies/${userId}`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo obtener los datos del perfil`);
      }

      const data = await response.json();

      const profileData: Profile = {
        name: data.name || '',
        fullName: data.name || '',
        email: data.email || '',
        telephone: data.telephone || '',
        address: data.address || '',
        city: data.city || '',
        zipCode: data.zipCode || '',
        nif: data.nif || '',
        description: data.description || '',
        dni: isCustomer ? data.dni || '' : '',
        password: 'Contraseña',
        plan: data.plan || { id: 1, planType: 'FREE' },
      };

      setEditedProfile(profileData);
      setOriginalProfile(profileData);
      setSelectedPlan(profileData.plan.planType);
    } catch (error: any) {
      console.error('Error al obtener el perfil:', error.message);
      showNotification({
        message: 'Error al cargar el perfil. Por favor, inténtelo de nuevo más tarde',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [userId, isCustomer]);


  useEffect(() => {
    if (!userId) {
      return;
    };
    void fetchProfile();
  }, [userId, isCustomer]);

  useFocusEffect(
    useCallback(() => {
      setHasChanges(false); // Restablecer cambios al entrar en la pestaña
      fetchProfile(); // Cargar datos del usuario
    }, [fetchProfile])
  );

  const handleInputChange = (field: keyof Profile, value: string) => {
    setEditedProfile((prev) => {
      const updatedProfile = { ...prev, [field]: value };
      setHasChanges(JSON.stringify(updatedProfile) !== JSON.stringify(originalProfile));
      return updatedProfile;
    });
  };

  const handleSave = async () => {

    if (!editedProfile) {
      showNotification({
        message: 'No se encontraron cambios para guardar.',
        type: 'error',
      });
      return;
    }
    if (editedProfile.password.length < 6) {
      showNotification({
        message: 'La contraseña debe tener al menos 6 caracteres.',
        type: 'error',
      });
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No se encontró el token de autenticación.');

      const endpoint = isCustomer
        ? `${BACKEND_API}/api/auth/admin/customers/${userId}`
        : `${BACKEND_API}/api/auth/admin/companies/${userId}`;

      const profileToSend: any = {
        fullName: isCustomer ? editedProfile.fullName : undefined,
        name: !isCustomer ? editedProfile.fullName : undefined,
        email: editedProfile.email,
        telephone: editedProfile.telephone,
        address: editedProfile.address,
        city: editedProfile.city,
        zipCode: editedProfile.zipCode,
        nif: editedProfile.nif,
        description: editedProfile.description,
      };

      if (isCustomer) {
        profileToSend.dni = editedProfile.dni;
      }

      const passwordChanged = editedProfile.password && editedProfile.password !== originalProfile?.password;

      if (passwordChanged) {
        profileToSend.password = editedProfile.password;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileToSend),
      });

      if (!response.ok) throw new Error(`Error ${response.status}: No se pudo actualizar el perfil.`);

      if (passwordChanged) {
        const passwordUpdateResponse = await fetch(`${BACKEND_API}/api/auth/password/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            newPassword: editedProfile.password,
            confirmPassword: editedProfile.password,
          }),
        });

        if (!passwordUpdateResponse.ok) throw new Error(`Error ${passwordUpdateResponse.status}: No se pudo actualizar la contraseña.`);
      }

      showNotification({
        message: 'Perfil actualizado correctamente',
        type: 'success',
      });
      setHasChanges(false);
      setOriginalProfile(editedProfile);

      navigation.navigate('admin/listUsers' as never);

    } catch (error: any) {
      console.error('Error al guardar los cambios:', error.message);
      showNotification({
        message: 'Error al guardar los cambios. Por favor, inténtelo de nuevo más tarde',
        type: 'error',
      });
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
      <CustomTextInput
        style={styles.input}
        value={value ?? ''}
        onChangeText={(text) => { handleInputChange(field, text) }}
        placeholder={placeholder}
        placeholderTextColor={'#666'}
        maxLength={
          field === 'password'
            ? 36
            : field === 'telephone'
              ? 9
              : field === 'description'
                ? 500
                : 50
        } secureTextEntry={secureTextEntry}
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
              {renderEditableField('Contraseña', editedProfile.password, 'password', 'Contraseña', true)}
              {renderEditableField('Email', editedProfile.email, 'email', 'Correo electrónico')}
              {renderEditableField('Teléfono', editedProfile.telephone, 'telephone', 'Teléfono')}
              {renderEditableField('DNI', editedProfile.dni ?? '', 'dni', 'DNI')}
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
            <CustomButton
              title="Guardar"
              onPress={() => {
                if (!hasChanges) {
                  showNotification({
                    message: "Es necesario modificar alguno de los campos antes de guardar",
                    type: "error",
                  });
                } else {
                  handleSave();
                }
              }}
              color={hasChanges ? 'blue' : 'red'}
            />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.white,
    paddingVertical: 10,
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
    minWidth: 300,
    width: '100%',
    fontSize: 16,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 20,
    alignSelf: 'center',
    textAlign: 'center',
  },
  changePlanText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  changePlanLink: {
    color: '#42B5FC',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 15,
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    width: 100,
    height: 35,
    borderRadius: 8,
  },
});

export default withAuth(EditUserScreen, [AUTHORITIES.ADMIN]);
