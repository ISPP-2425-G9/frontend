import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import ObituaryForm from '@/components/ObituaryForm';
import useAuth from "@/hooks/useAuth";
import { BACKEND_API } from "@/constants/Mysc";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ObituaryStyles from './obituariesStyles';    

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
};

export default function EditObituaryScreen() {
  const { isAuthenticated } = useAuth();
  const route = useRoute<EditObituaryRouteProp>();
  const params = route.params ?? {};

  const {
    imageUrl,
    imageTemplateId,
    obituaryId,
    jsonData,
    changeDesign,
    selectedColor: routeColor,
  } = params || {};

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    deathDate: '',
    farewellMessage: '',
    farewellPhrase: '',
    customImage: undefined,
    imageTemplate_id: imageTemplateId,
  });

  console.log(imageTemplateId, 'imageTemplateId');

  const [selectedColor, setSelectedColor] = useState(routeColor);
  const [isMine, setIsMine] = useState(false);
  const [isSended, setIsSended] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchObituary = async () => {
      try {
        if (changeDesign && jsonData) {
          const parsedData = JSON.parse(jsonData);

          setFormData({
            name: parsedData.name || '',
            birthDate: parsedData.birthDate || '',
            deathDate: parsedData.deathDate || '',
            farewellMessage: parsedData.farewellMessage || '',
            farewellPhrase: parsedData.farewellPhrase || '',
            customImage: parsedData.customImage || undefined,
            imageTemplate_id: imageTemplateId || 1,
          });

          setSelectedColor(parsedData.wordColor || routeColor);
          setIsMine(true);
          setIsSended(false);
        } else {
          const authToken = await AsyncStorage.getItem("authToken");
          if (!authToken) throw new Error("Token de autenticación no encontrado.");

          const response = await fetch(
            `${BACKEND_API}/api/obituary/myObituaries/${obituaryId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken.trim()}`,
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener la esquela.');
          }

          const data = await response.json();

          const formatDate = (date?: string) => {
            const [year, month, day] = date?.split('-') || [];
            return day && month && year ? `${day}/${month}/${year}` : '';
          };

          setFormData({
            name: data.name || '',
            birthDate: data.birthDate ? formatDate(data.birthDate) : '',
            deathDate: data.deathDate ? formatDate(data.deathDate) : '',
            farewellMessage: data.farewellMessage || '',
            farewellPhrase: data.farewellPhrase || '',
            customImage: data.customImageUrl || undefined,
            imageTemplate_id: data.imageTemplate?.id || 1,
          });

          setSelectedColor(`rgb(${data.wordColor})`);
          setIsMine(data.isMine);
          setIsSended(!data.isMine);
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (obituaryId) {
      fetchObituary();
    }
  }, [obituaryId, changeDesign, jsonData, imageTemplateId, routeColor]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ObituaryForm
      key={'stay'}
      isAuthenticated={isAuthenticated ?? false}
      mode="edit"
      obituaryId={obituaryId}
      is_newObituary={false}
      is_mine={isMine}
      formData={formData}
      imageUrl={imageUrl}
      letterColor={selectedColor}
      styles={ObituaryStyles}
    />
  );
}
