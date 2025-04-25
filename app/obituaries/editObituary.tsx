import React, { useCallback, useState } from 'react';
import ObituaryForm from '@/components/ObituaryForm';
import useAuth from "@/hooks/useAuth";
import ObituaryStyles from './obituariesStyles';
import { RouteProp, useRoute } from "@react-navigation/native";
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_API } from "@/constants/Mysc";


type EditObituaryRouteProp = RouteProp<RootStackParamList, 'obituaries/editObituary'>;

type RootStackParamList = {
  'obituaries/editObituary': {
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
    const route = useRoute<EditObituaryRouteProp>();
    const params = route.params ?? {};
  
    const {
      imageUrl = '',
      is_newObituary = false,
      imageTemplateId = 1,
      obituaryId = 0,
      jsonData = '',
      changeDesign = false,
      selectedColor: routeColor = ''
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
  
    const [isMine, setIsMine] = useState(false);
    const [selectedColor, setSelectedColor] = useState(routeColor);
    const [isSended, setIsSended] = useState(false);
  
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
                imageTemplate_id: imageTemplateId || 1,
              });
              setSelectedColor(parsedData.wordColor);
              return;
            } catch (error) {
              console.error("Error al analizar los datos JSON:", error);
            }
          } else {
            try {
              const authToken = await AsyncStorage.getItem("authToken");
              if (!authToken) throw new Error("No se encontró un token de autenticación");
  
              const response = await fetch(
                `${BACKEND_API}/api/obituary/myObituaries/${obituaryId}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken.trim()}`,
                  },
                }
              );
  
              if (!response.ok) throw new Error("Error al obtener los datos");
              const data = await response.json();
  
              const formatDate = (date?: string): string => {
                const [year, month, day] = date?.split("-") || [];
                return day && month && year ? `${day}/${month}/${year}` : "";
              };
  
              const formatBirthDate = data.birthDate ? formatDate(data.birthDate) : "";
              const formatDeathDate = data.deathDate ? formatDate(data.deathDate) : "";
  
              setSelectedColor(`rgb(${data.wordColor})`);
              setIsMine(data.isMine);
              setIsSended(!data.isMine);
  
              setFormData({
                name: data.name || "",
                birthDate: formatBirthDate,
                deathDate: formatDeathDate,
                farewellMessage: data.farewellMessage || "",
                farewellPhrase: data.farewellPhrase || "",
                customImage: data.customImageUrl || null,
                imageTemplate_id: data.imageTemplate?.id || 1,
              });
            } catch (error) {
              console.error("Error al cargar la esquela:", error);
            }
          }
        };
  
        fetchData();
      }, [obituaryId])
    );
  
    return (
      <ObituaryForm
        key={is_newObituary ? Date.now() : 'stay'}
        isAuthenticated={isAuthenticated ?? false}
        mode="edit"
        obituaryId={obituaryId}
        is_newObituary={is_newObituary}
        is_mine={isMine}
        letterColor={selectedColor}
        formData={formData}
        imageUrl={imageUrl}
        styles={ObituaryStyles}
      />
    );
  }
  