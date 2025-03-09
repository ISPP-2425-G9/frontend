import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, useWindowDimensions, ScrollView, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '@/components/CustomButton';
import { GlobalStyles } from '@/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { BACKEND_API } from '@/constants/Mysc';


type RootStackParamList = {
  'obituaries/createObituary': { imageTemplateId: number; imageUrl: string, is_newObituary: boolean, obituaryId: number };
  'obituaries/index': undefined;
};

export default function ObituaryIndex() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width, height } = useWindowDimensions(); 
  

  interface Obituary {
    obituaryId: number;
    name: string;
    isMine: boolean;
    imageTemplate: {
      imageId: number;
      imageUrl: string;
    };
  }

  const [obituaries, setObituaries] = useState<Obituary[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const authToken = await AsyncStorage.getItem('authToken');
          if (!authToken) throw new Error('No se encontró un token de autenticación');
    
          const response = await fetch(BACKEND_API+'/api/obituary/myObituaries', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken.trim()}`,
            },
          });
    
          if (response.ok) {
            const data: Obituary[] = await response.json();
            setObituaries(data);
          }
  
        } catch (error) {
          console.error('Error en la solicitud:', error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
    }, [])
  );
  
  

  const handleObituaryPress = (imageTemplateId: number, imageUrl: string, obituaryId: number) => {
    navigation.navigate(
      'obituaries/createObituary', { 
        imageTemplateId, 
        imageUrl,
        is_newObituary: false,
        obituaryId,
       });
  };

  if (loading) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText type="title">Cargando...</ThemedText>
      </ThemedView>
    );
  }

  const handleDeleteObituary = async (obituaryId: number) => {
    console.log('Eliminando esquela con id:', obituaryId);
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Sus esquelas</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {obituaries.map((item) => (
            console.log(item),
             <TouchableOpacity
             key={item.obituaryId} 
             onPress={() => handleObituaryPress(item.imageTemplate.imageId, item.imageTemplate.imageUrl, item.obituaryId)} 
             style={[
               styles.obituaryCard, 
               { 
                 width: width * 0.20, 
                 height: height * 0.65, 
                 borderColor: item.isMine ? GlobalStyles.blue : GlobalStyles.grey,  
                 borderWidth: 6,  
               }
             ]} 
           >
              <Image source={{ uri: item.imageTemplate.imageUrl }} style={styles.image} />
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>{item.isMine ? `${item.name} (Su propia esquela)` : item.name}</Text>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <CustomButton title="Eliminar" color="red" onPress={() => handleDeleteObituary(item.obituaryId)}/>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.divider} />
      <View style={styles.buttonContainer}>
        <CustomButton title="Crea una esquela" onPress={() => navigation.navigate('obituaries/index')} />
      </View>   
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flex: 1,
    alignItems: 'center',
    paddingTop: 120,
    backgroundColor: '#ffff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  listContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  obituaryCard: {
    margin: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  buttonContainer: {
    width: '90%',
    alignItems: 'flex-end', 
    marginBottom: '0.5%', 
    marginRight: '6%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    borderRadius: 8,
    padding: '20%',
  },
  overlayText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
