import React, { useState } from 'react';
import useAuth from "@/hooks/useAuth";
import messageStyles from './messageStyles';    
import MessageForm from '@/components/MessageForm';


export default function createObituaryScreen() {
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    customImages: [] as string[],
  });

  
  return (
    <MessageForm
      key={Date.now()}
      isAuthenticated={isAuthenticated ?? false}
      mode="create"
      isOwner={true}
      is_newMessage={true}
      formData={formData}
      styles={messageStyles}
    />
  );
}