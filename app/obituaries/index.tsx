import { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Dimensions, ScrollView, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  'obituaries/createObituary': { obituaryId: number; imageUrl: string };
};

export default function ObituaryIndex() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  interface Obituary {
    id: number;
    name: string;
    date: string;
    description: string;
    image: any;
  }

  const [obituaries, setObituaries] = useState<Obituary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    fetch('/api/templates/urls')
      .then(response => {
        console.log("hola", response);
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        return response.json();
      })
      .then(data => {
        setObituaries(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
        setLoading(false);
      });
  }, []);
  

  const handleObituaryPress = (id: number, imageUrl: string) => {
    navigation.navigate('obituaries/createObituary', { obituaryId: id, imageUrl });
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
      <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 30 }}>Seleccione su esquela</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {obituaries.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => handleObituaryPress(item.id, item.image)} style={styles.obituaryCard}>
              <Image source={item.image} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    width: width * 0.20,
    height: height * 0.65,
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
});

