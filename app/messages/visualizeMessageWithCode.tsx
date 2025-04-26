import React, { useCallback, useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import messageStyles from './messageStyles';
import MessageForm from '@/components/MessageForm';
import CustomTextInput from '@/components/CustomTextInput';
import CustomButton from '@/components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_API } from '@/constants/Mysc';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useNotification } from '@/context/NotificationContext';
import { Dimensions, Text, View, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  'messages/visualizeMessageWithCode': {
    messageId: number;
  };
};

type EditMesageRouteProp = RouteProp<RootStackParamList, 'messages/visualizeMessageWithCode'>;

type Contact = {
  id: number;
  name: string;
  telephone: string;
  email: string;
};

export default function VisualizeMessageWithCodeScreen() {
  const { isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const route = useRoute<EditMesageRouteProp>();
  const messageId = route.params?.messageId;

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    customImages: [] as string[],
  });

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [code, setCode] = useState<string>('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const handleVerifyCode = async () => {
    if (!code || code.length !== 5) {
      showNotification({
        message: 'El código debe tener 5 números',
        type: 'info',
        duration: 2500,
      });
      return;
    }

    try {
      const response = await fetch(`${BACKEND_API}/api/messages/${messageId}/validate-code/${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      setIsCodeVerified(true);
      setCode('');

      setFormData({
        title: data.title,
        body: data.body,
        customImages: data.customImages || [],
      });

      const formatPhoneNumber = (phone: string) => {
        return phone.replace(/\D/g, '').replace(/(\d{3})(?=\d)/g, '$1 ');
      };

      const contactsData = data.recipients.map((contact: any) => ({
        id: Date.now(),
        name: contact.name,
        telephone: formatPhoneNumber(contact.telephone),
        email: contact.email,
      }));

      setContacts(contactsData);
    } catch (error) {
      showNotification({
        message: 'Código erróneo. Inténtalo de nuevo.',
        type: 'error',
        duration: 3000,
      });
    }
  };

  const fetchMessageData = useCallback(async () => {
    if (!isCodeVerified) return;

    try {
      const authToken = await AsyncStorage.getItem('authToken');

      if (!authToken) {
        console.error('No se encontró el token de autenticación');
        return;
      }

      const response = await fetch(`${BACKEND_API}/api/messages/${messageId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title,
          body: data.body,
          customImages: data.customImages || [],
        });

        const formatPhoneNumber = (phone: string) => {
          return phone.replace(/\D/g, '').replace(/(\d{3})(?=\d)/g, '$1 ');
        };

        const contactsData = data.recipients.map((contact: any) => ({
          id: Date.now(),
          name: contact.name,
          telephone: formatPhoneNumber(contact.telephone),
          email: contact.email,
        }));

        setContacts(contactsData);
      } else {
        console.error('Error al obtener los datos del mensaje');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }, [messageId, isCodeVerified]);

  useEffect(() => {
    if (messageId && isCodeVerified) {
      fetchMessageData();
    }
  }, [fetchMessageData]);

  return (
    <View style={{ flex: 1 }}>
      {!isCodeVerified ? (
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>Ingresa el código</Text>
          <CustomTextInput
            placeholder="Código"
            value={code}
            maxLength={5}
            onChangeText={(text) => setCode(text)}
            style={styles.input}
          />
          <CustomButton
            style={styles.addButton}
            title="Enviar"
            onPress={handleVerifyCode}
          />
        </View>
      ) : (
        <MessageForm
          key={Date.now()}
          isAuthenticated={isAuthenticated ?? false}
          mode="view"
          url={''}
          isOwner={true}
          is_newMessage={false}
          formData={formData}
          contacts={contacts}
          styles={messageStyles}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  codeContainer: {
    width: width > 600 ? '100%' : '100%',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    alignSelf: 'center' as 'center',
    padding: 20,
    marginTop: 20,
  },
  codeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: 250,
    marginVertical: 5,
  },
  addButton: {
    width: '10%',
    alignSelf: 'center',
    marginTop: 10,
    height: 40,
  },
});

