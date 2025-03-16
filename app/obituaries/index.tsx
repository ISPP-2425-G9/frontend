import { useEffect, useState } from 'react';
import { StyleSheet, Image, View, useWindowDimensions, ScrollView, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import CustomButton from '@/components/CustomButton';
import useAuth from "@/hooks/useAuth";
import { BACKEND_API } from '@/constants/Mysc';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

type RootStackParamList = {
  'obituaries/createObituary': { imageTemplateId: number,
     imageUrl: string, 
     is_newObituary: boolean, 
     obituaryId: number,
     jsonData: string
    };
  'obituaries/listMyObituaries': undefined;
  'obituaries/index': { 
    is_newObituary: boolean,
     obituaryId: number, 
     jsonData: string 
    };

};



function ObituaryIndex() {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, 'obituaries/index'>>();
  const { width, height } = useWindowDimensions(); 

  const is_newObituary = route.params?.is_newObituary ?? true;

  interface Obituary {
    id: number
    imageId: number;
    imageUrl: string;
  }

  const [obituaries, setObituaries] = useState<Obituary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(BACKEND_API+'/api/templates/urls');
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

  const handleObituaryPress = (id: number, imageUrl: string) => {
    const obituaryId = route.params?.obituaryId ?? undefined;
    const jsonData = route.params?.jsonData ?? undefined;    
    navigation.navigate('obituaries/createObituary', { 
      imageTemplateId: id, 
      imageUrl,
      is_newObituary,
      obituaryId,
      jsonData

    });
  };
  

  if (loading) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText type="title">Cargando...</ThemedText>
      </ThemedView>
    );
  }

  return isAuthenticated ? (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Elija el diseño</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
        {obituaries.map((item) => (
          <TouchableOpacity
            key={item.id}  
            onPress={() => handleObituaryPress(item.id, item.imageUrl)} 
            style={[styles.obituaryCard]} 
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          </TouchableOpacity>
        ))}
        </View>
      </ScrollView>
      <View style={styles.divider} />
        <View style={styles.buttonContainer}>
          <CustomButton title="Sus esquelas" onPress={() => navigation.navigate('obituaries/listMyObituaries')} />
        </View>   
      </ThemedView>
  ) : (
    <ThemedView style={styles.container}>
    <Text style={styles.title}>Esquelas</Text>
    <ThemedText type="default">Para poder crear una esquela, debe iniciar sesión.</ThemedText>  
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
    width: width * 0.20, 
    height: height * 0.65 
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
});

export default withAuth(ObituaryIndex, [AUTHORITIES.CUSTOMER])