import React, { useCallback, useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import messageStyles from './messageStyles';
import MessageForm from '@/components/MessageForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_API } from '@/constants/Mysc';
import { RouteProp, useRoute } from "@react-navigation/native";

type EditMesageRouteProp = RouteProp<RootStackParamList, 'messages/editMessage'>;

type RootStackParamList = {
  'messages/editMessage': {
    messageId: number;
  };

};

type Contact = {
  id: number;
  name: string;
  telephone: string;
  email: string;
};



export default function editMessageScreen() {
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    customImages: [] as string[],
  });

  const route = useRoute<EditMesageRouteProp>();

  const [contacts, setContacts] = useState<Contact[]>([]);

  const messageId = route.params?.messageId ;

  const fetchMessageData = useCallback(async () => {
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
  }, [messageId]);

  useEffect(() => {
    if (messageId) {
      fetchMessageData();
    }
  }, [fetchMessageData]);

  return (
    <MessageForm
      key={Date.now()}
      isAuthenticated={isAuthenticated ?? false}
      mode="edit"
      isOwner={true}
      is_newMessage={false}
      formData={formData}
      styles={messageStyles}
    />
  );
}
