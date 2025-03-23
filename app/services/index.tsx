import { StyleSheet, Text, ScrollView, ActivityIndicator, View } from 'react-native';
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
        const response = await fetch(BACKEND_API + '/api/companies/premium', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken.trim()}`
          }
        });
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data.content)) {
          setSponsors(data.content);
        } else {
          console.warn('La respuesta no contiene un array en "content"');
          setSponsors([]);
        }
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>Empresas destacadas del sector</Text>
          <Text style={styles.introText}>
            En esta sección, presentamos las empresas que están suscritas a <Text style={styles.highlight}>CARONTE</Text>,
            ofreciendo soluciones y servicios especializados en el sector funerario.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={GlobalStyles.blue} />
        ) : (
          <View style={styles.listContainer}>
            {sponsors.map((item) => (
              <View key={item.nif} style={styles.sponsorWrapper}>
                <AdvertisementSponsor sponsor={item} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.white,
    paddingVertical: 120,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
  },
  introContainer: {
    width: '90%',
    backgroundColor: GlobalStyles.lightGrey,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: GlobalStyles.darkGrey,
    marginBottom: 10,
    textAlign: 'center',
  },
  introText: {
    fontSize: 20,
    color: GlobalStyles.darkGrey,
    textAlign: 'center',
    lineHeight: 22,
  },
  highlight: {
    fontWeight: 'bold',
    color: GlobalStyles.blue,
  },
  listContainer: {
    width: '100%',
    alignItems: 'center',
    marginLeft: 37,
  },
  sponsorWrapper: {
    width: '100%',
    maxWidth: 750,
    marginHorizontal: 'auto',
    alignSelf: 'center',
    marginBottom: 16,
  },
});

export default withAuth(ListServiceScreen, [AUTHORITIES.CUSTOMER, AUTHORITIES.COMPANY]);
