import React, { useCallback, useState } from 'react';
import ObituaryForm from '@/components/ObituaryForm';
import useAuth from "@/hooks/useAuth";
import ObituaryStyles from './obituariesStyles';
import { RouteProp, useRoute } from "@react-navigation/native";
import { useFocusEffect } from 'expo-router';

type CreateObituaryRouteProp = RouteProp<RootStackParamList, 'obituaries/createObituary'>;

type RootStackParamList = {
  'obituaries/createObituary': {
    imageUrl: string;
    imageTemplateId: number;
    is_newObituary: boolean;
    obituaryId: number;
    is_mine: boolean;
    jsonData: string;
    changeDesign: boolean;
    selectedColor: string;
  };

  "obituaries/selectContacts": {
    jsonData: string,
    is_newObituary: boolean,
    obituaryId: number,
    is_mine: boolean,
    isMine: boolean 
  };
};

export default function createObituaryScreen() {
  const { isAuthenticated } = useAuth();
  const route = useRoute<CreateObituaryRouteProp>();
  const params = route.params ?? {};

  const {
    imageUrl = '',
    is_newObituary = true,
    imageTemplateId = 1,
    is_mine = false,
    jsonData = '',
    changeDesign = false,
    selectedColor = '#000',
    obituaryId = 0,
  } = params;

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    deathDate: '',
    farewellMessage: '',
    farewellPhrase: '',
    customImage: undefined,
    imageTemplate_id: imageTemplateId,
  });

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (changeDesign && jsonData) {
          try {
            const parsedData = await JSON.parse(jsonData); 
            setFormData({
              name: parsedData.name || "",
              birthDate: parsedData.birthDate || "",
              deathDate: parsedData.deathDate || "",
              farewellMessage: parsedData.farewellMessage || "",
              farewellPhrase: parsedData.farewellPhrase || "",
              customImage: parsedData.customImage || undefined,
              imageTemplate_id: imageTemplateId,
            });
          } catch (error) {
            console.error("Error al parsear jsonData:", error);
          }
        } else {
          setFormData({
            name: "",
            birthDate: "",
            deathDate: "",
            farewellMessage: "",
            farewellPhrase: "",
            customImage: undefined,
            imageTemplate_id: imageTemplateId,
          });
        }
      };
      fetchData();
    }, [changeDesign, jsonData, imageTemplateId, is_newObituary]) 
  );

  return (
    <ObituaryForm
      key={is_newObituary ? Date.now() : 'stay'}
      isAuthenticated={isAuthenticated ?? false}
      mode="create"
      obituaryId={obituaryId}
      is_newObituary={is_newObituary}
      is_mine={is_mine}
      letterColor={selectedColor}
      formData={formData}
      imageUrl={imageUrl}
      styles={ObituaryStyles}
    />
  );
}