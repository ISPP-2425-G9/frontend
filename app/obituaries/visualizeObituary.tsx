import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import ObituaryForm from '@/components/ObituaryForm';
import useAuth from "@/hooks/useAuth";
import { BACKEND_API } from "@/constants/Mysc";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ObituaryStyles from './obituariesStyles';    
import { withAuth } from "../_util/withAuth";
import { AUTHORITIES } from "../_util/Authorities";

type VisualizeObituaryRouteProp = RouteProp<RootStackParamList, 'obituaries/visualizeObituary'>;

type RootStackParamList = {
  'obituaries/visualizeObituary': {
    imageUrl: string;
    obituaryId: number;
  };
};


function VisualizeObituaryScreen() {
  const { isAuthenticated } = useAuth();
  const route = useRoute<VisualizeObituaryRouteProp>();
  const params = route.params ?? {};

  const {
    imageUrl,
    obituaryId,
  } = params || {};

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    deathDate: '',
    farewellMessage: '',
    farewellPhrase: '',
    customImage: undefined,
  });

  const [loading, setLoading] = useState(true);
  const [ isMine, setIsMine] = useState(false);

  useEffect(() => {
    const fetchObituary = async () => {
      try {
        const authToken = await AsyncStorage.getItem("authToken");
        if (!authToken) throw new Error("Token de autenticación no encontrado.");

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
          name: data.name || '',
          birthDate: data.birthDate || '',
          deathDate: data.deathDate || '',
          farewellMessage: data.farewellMessage || '',
          farewellPhrase: data.farewellPhrase || '',
          customImage: data.customImage || undefined,
        });
        setIsMine(data.isMine || false);
      } catch (error) {
        console.error("Error al obtener la esquela:", error);
      } finally {
        setLoading(false);
      }
    };

    if (obituaryId) fetchObituary();
  }, [obituaryId]);

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
      mode="view"
      obituaryId={obituaryId}
      is_newObituary={false}
      is_mine={isMine}
      formData={formData}
      imageUrl={imageUrl}
      letterColor={'undefined'}
      styles={ObituaryStyles}
    />
  );
}
export default withAuth(VisualizeObituaryScreen, [AUTHORITIES.CUSTOMER])