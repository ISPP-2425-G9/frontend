import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import ObituaryForm from '@/components/ObituaryForm';
import useAuth from "@/hooks/useAuth";
import { BACKEND_API } from "@/constants/Mysc";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ObituaryStyles from './obituariesStyles';    

type VisualizeObituaryRouteProp = RouteProp<RootStackParamList, 'obituaries/visualizeObituary'>;

type RootStackParamList = {
    'obituaries/visualizeObituary': {
    imageUrl: string;
    is_mine: boolean;
    obituaryId: number;
    };
};

export default function ViewObituaryScreen() {
  const { isAuthenticated } = useAuth();
  const route = useRoute<VisualizeObituaryRouteProp>();
  const {
    imageUrl,
    is_mine,
    obituaryId,
  } = route.params;

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    deathDate: '',
    farewellMessage: '',
    farewellPhrase: '',
    customImage: undefined as string | undefined,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchObituary = async () => {
        setLoading(true);
        try {
            const authToken = await AsyncStorage.getItem("authToken");
    
            if (!authToken) {
            throw new Error("Token de autenticación no encontrado.");
            }
    
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
    
            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al obtener la esquela.");
            }
    
            const data = await response.json();
            setFormData({
            name: data.name,
                birthDate: data.birthDate || "",
                deathDate: data.deathDate || "",
                farewellMessage: data.farewellMessage || "",
                farewellPhrase: data.farewellPhrase || "",
                customImage: data.customImage || undefined,
            });
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener la esquela:", error);
        }
        };
    
        fetchObituary();
    }, []);
  



  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ObituaryForm
      key={'staty'}
      isAuthenticated={isAuthenticated ?? false}
      mode="view"
      obituaryId={route.params.obituaryId}
      is_newObituary={false}
      is_mine={is_mine}
      formData={formData}
      imageUrl={imageUrl}
      letterColor={'undefined'}
      styles={ObituaryStyles}
    />
  );
}
