import { StyleSheet, Text, FlatList, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { AUTHORITIES } from '../_util/Authorities';
import { withAuth } from '../_util/withAuth';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStyles } from '@/constants/Colors';
import AdvertisementSponsor from '@/components/AdvertisementSponsor';
import { BACKEND_API } from '@/constants/Mysc';


type Sponsor = {
  name: string;
  email: string;
  telephone: string;
  address: string;
  city: string;
  zipCode: string;
  imageUrl: string;
  description: string;
  nif: string;
};

const ListServiceScreen: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) throw new Error('No se encontró un token de autenticación');
        AsyncStorage.getItem('authToken').then(token => console.log('Token almacenado:', token));

        const response = await fetch(BACKEND_API + '/api/companies/premium', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken.trim()}`
          }
        });

        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);

        const data = await response.json();
        setSponsors(data);
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Empresas destacadas del sector</Text>
      {loading ? (
        <ActivityIndicator size="large" color={GlobalStyles.blue} />
      ) : (
        <FlatList
          data={sponsors}
          keyExtractor={(item) => item.nif}
          renderItem={({ item }) => <AdvertisementSponsor sponsor={item} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flex: 1,
    alignItems: 'center',
    paddingTop: 120,
    backgroundColor: GlobalStyles.white,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    color: GlobalStyles.darkGrey,
  },
  listContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});

export default withAuth(ListServiceScreen, [AUTHORITIES.CUSTOMER, AUTHORITIES.COMPANY]);
