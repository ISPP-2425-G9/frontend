import AdvertisementSponsor from '@/components/AdvertisementSponsor';
import { ThemedView } from '@/components/ThemedView';
import { GlobalStyles } from '@/constants/Colors';
import { BACKEND_API } from '@/constants/Mysc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AUTHORITIES } from '../_util/Authorities';
import { withAuth } from '../_util/withAuth';
import CustomTextInput from '@/components/CustomTextInput';
import CustomButton from '@/components/CustomButton';
import { useWindowDimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';


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
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [companyTypes, setCompanyTypes] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const { width } = useWindowDimensions();
  const isMobile = width < 768;


  const fetchSponsors = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) throw new Error('No se encontró un token de autenticación');
  
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('size', '5');
  
      if (city) params.append('city', city);
      if (name) params.append('name', name);
      if (companyType) params.append('companyType', companyType);
  
      const response = await fetch(`${BACKEND_API}/api/companies/premium?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${authToken.trim()}`
        }
      });
  
      if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
      const data = await response.json();
  
      if (Array.isArray(data.content)) {
        setSponsors(data.content);
        setTotalPages(data.totalPages);
      } else {
        setSponsors([]);
      }
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, [page, city, name, companyType]);

  const fetchCompanyTypes = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) throw new Error('No se encontró un token de autenticación');
      const response = await fetch(`${BACKEND_API}/api/companies/companiesTypes`, {
        headers: {
          'Authorization': `Bearer ${authToken.trim()}`
        }
      });
      if (!response.ok) throw new Error(`Error al obtener los tipos: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setCompanyTypes(data);
      }
    } catch (error) {
      console.error('Error fetching company types:', error);
    }
  };
  
  useEffect(() => {
    fetchCompanyTypes();
  }, []);
  

  useFocusEffect(
      React.useCallback(() => {
        document.title = 'Servicios';
      }, [])
    );

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
        {/* FILTRADO */}
        <View style={[styles.filterContainer, isMobile && styles.filterContainerMobile]}>
          <CustomTextInput
            placeholder="Buscar por ciudad"
            value={city}
            onChangeText={setCity}
          />
          <CustomTextInput
            placeholder="Buscar por nombre"
            value={name}
            onChangeText={setName}
          />
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={companyType}
              onValueChange={(itemValue) => {
                setCompanyType(itemValue);
                setPage(0);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Tipo de empresa" value="" />
              {companyTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
        </View>
        {/* LISTADO DE SPONSORS */}
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
        {/* PAGINACIÓN */}
        <View style={[styles.paginationContainer, isMobile && styles.paginationContainerMobile]}>
          <CustomButton
            title="Anterior"
            onPress={() => {
              if (page > 0) setPage(page - 1);
            }}
            color="grey"
            style={{ opacity: page === 0 || totalPages <= 1 ? 0.5 : 1 }}
          />
          <Text style={{ marginHorizontal: 10 }}>{page + 1} / {totalPages}</Text>
          <CustomButton
            title="Siguiente"
            onPress={() => {
              if (page + 1 < totalPages) setPage(page + 1);
            }}
            color="blue"
            style={{ opacity: page + 1 >= totalPages || totalPages <= 1 ? 0.5 : 1 }}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.white,
    paddingTop: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
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
  filterContainer: {
    width: 400,
    alignItems: 'center',
    marginBottom: 10,
  },
  filterContainerMobile: {
    width: '100%',
    paddingHorizontal: 16,
  },  
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  paginationContainerMobile: {
    flexDirection: 'column',
    gap: 10,
  },  
  pickerWrapper: {
    width: '100%',
    backgroundColor: GlobalStyles.lightGrey,
    borderRadius: 15,
    marginVertical: 7.5,
    overflow: 'hidden',
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: 40,
    color: GlobalStyles.darkGrey,
    paddingHorizontal: 10,
    fontSize: 16,
  },  
});

export default withAuth(ListServiceScreen, [AUTHORITIES.CUSTOMER, AUTHORITIES.COMPANY]);
