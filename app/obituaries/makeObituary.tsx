import React, { useState } from 'react';
import ObituaryForm from '@/components/ObituaryForm';
import useAuth from "@/hooks/useAuth";
import ObituaryStyles from './obituariesStyles';
import { RouteProp, useRoute } from "@react-navigation/native";

type CreateObituaryRouteProp = RouteProp<RootStackParamList, 'obituaries/createObituary'>;

type RootStackParamList = {
  'obituaries/createObituary': {
    imageUrl: string;
    imageTemplateId: number;
    is_newObituary: boolean;
    obituaryId: number;
    is_mine: boolean;

  };

  "obituaries/selectContacts": {
    jsonData: string,
    is_newObituary: boolean,
    obituaryId: number,
    is_mine: boolean,
    isMine: boolean 
  };

};

export default function makeObituaryScreen() {
    const { isAuthenticated } = useAuth();
    const route = useRoute<CreateObituaryRouteProp>();
    const { imageUrl, is_newObituary } = route.params;

    


    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        deathDate: '',
        farewellMessage: '',
        farewellPhrase: '',
        customImage: undefined,
    });


    return (
        <ObituaryForm
        isAuthenticated={isAuthenticated ?? false}
        mode="create"
        obituaryId={route.params.obituaryId}
        isMine={true}
        formData={formData}
        imageUrl={imageUrl}
        modal={{ visible: false, message: '' }}
        styles={ObituaryStyles}
        />
    );
    }
