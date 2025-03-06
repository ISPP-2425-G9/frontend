import { useEffect, useState } from 'react';
import { StyleSheet, Image, View, useWindowDimensions, ScrollView, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '@/components/CustomButton';

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
    is_mine: boolean;
    imageTemplate: {
      imageId: number;
      imageUrl: string;
    };
  }

  const [obituaries, setObituaries] = useState<Obituary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) throw new Error('No se encontró un token de autenticación');
  
        const response = await fetch('http://localhost:8080/api/obituary/myObituaries', {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken.trim()}`,
          },
        });
  
        if (!response.ok) throw new Error('Error al obtener los datos');
  
        const data: Obituary[] = await response.json();
        setObituaries(data);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

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

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Tus esquelas</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {obituaries.map((item) => (
             <TouchableOpacity
             key={item.obituaryId} 
             onPress={() => handleObituaryPress(item.imageTemplate.imageId, item.imageTemplate.imageUrl, item.obituaryId)} 
             style={[
               styles.obituaryCard, 
               { 
                 width: width * 0.20, 
                 height: height * 0.65, 
                 borderColor: item.is_mine ? 'yellow' : 'blue',  
                 borderWidth: 2,  
               }
             ]} 
           >
              <Image source={{ uri: item.imageTemplate.imageUrl }} style={styles.image} />
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>{item.name}</Text>
                <Text style={styles.overlayText}>{item.is_mine ? 'Es tuya' : 'No es tuya'}</Text>
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
    padding: 10,
    margin: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
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
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    borderRadius: 8,
    padding: 5,
  },
  overlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
