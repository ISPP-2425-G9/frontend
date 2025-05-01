import React, { useState } from 'react';
import useAuth from "@/hooks/useAuth";
import messageStyles from './messageStyles';    
import MessageForm from '@/components/MessageForm';
import { useFocusEffect } from 'expo-router';
import { BACKEND_API } from '@/constants/Mysc';
import { withAuth } from "../_util/withAuth";
import { AUTHORITIES } from "../_util/Authorities";

function createMessageScreen() {
  const { isAuthenticated } = useAuth();


  const [formData, setFormData] = useState({
    title: '',
    body: '',
    customImages: [] as string[],
  });

  const url = `${BACKEND_API}/api/messages`;

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setFormData({
          title: '',
          body: '',
          customImages: [] as string[],
        });
      };
      fetchData();
    }, [])
  );

  return (
    <MessageForm
      key={Date.now()}
      isAuthenticated={isAuthenticated ?? false}
      mode="create"
      url={url}
      isOwner={true}
      is_newMessage={true}
      formData={formData}
      contacts={[]}
      styles={messageStyles}
    />
  );
}

export default withAuth(createMessageScreen, [AUTHORITIES.CUSTOMER])