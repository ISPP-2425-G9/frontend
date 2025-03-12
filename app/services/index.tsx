import { StyleSheet, Text, FlatList, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { AUTHORITIES } from '../_util/Authorities';
import { withAuth } from '../_util/withAuth';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStyles } from '@/constants/Colors';
import AdvertisementSponsor from '@/components/AdvertisementSponsor';
import { BACKEND_API } from '@/constants/Mysc';


const fallbackSponsors: Sponsor[] = [
  {
    name: 'Tech Solutions', email: 'info@techsolutions.com', telephone: '123-456-7890', address: 'Calle 123',
    city: 'Madrid', zipCode: '28001', imageUrl: 'https://purina.com.sv/sites/default/files/2024-04/razas-de-perros-grandes-labrador-sv.jpg',
    description: 'Eco Energy se especializa en energía renovable, ofreciendo soluciones solares y eólicas para empresas y hogares. Nuestra misión es reducir la huella de carbono y promover un mundo más sostenible con tecnología avanzada y accesibleuehqfuihqufhqruhfquhrfuqhrhfuqhrufhqurhfuhqruhfuqhrfuhqruhfuqhr.', nif: 'B87654321'
  },
  {
    name: 'Eco Energy', email: 'contact@ecoenergy.com', telephone: '987-654-3210', address: 'Avenida Verde',
    city: 'Sevilla', zipCode: '28001', imageUrl: 'https://purina.com.sv/sites/default/files/2024-04/razas-de-perros-grandes-labrador-sv.jpg',
    description: 'Eco Energy se especializa en energía renovable, ofreciendo soluciones solares y eólicas para empresas y hogares. Nuestra misión es reducir la huella de carbono y promover un mundo más sostenible con tecnología avanzada y accesible.', nif: 'B87654321'
  },
  {
    name: 'HealthFirst', email: 'support@healthfirst.com', telephone: '654-321-0987', address: 'Plaza Salud',
    city: 'Madrid', zipCode: '28001', imageUrl: 'https://purina.com.sv/sites/default/files/2024-04/razas-de-perros-grandes-labrador-sv.jpg',
    description: 'HealthFirst ofrece servicios médicos y salud digital, brindando atención personalizada y tecnología avanzada para mejorar la calidad de vida de nuestros pacientes. Contamos con un equipo de especialistas y una red de clínicas en todo el país.', nif: 'C23456789'
  },
  {
    name: 'BuildCorp', email: 'contact@buildcorp.com', telephone: '321-654-9870', address: 'Calle Obra',
    city: 'Sevilla', zipCode: '28001', imageUrl: 'https://purina.com.sv/sites/default/files/2024-04/razas-de-perros-grandes-labrador-sv.jpg',
    description: 'BuildCorp es una empresa de construcción con más de 20 años de experiencia en el sector. Nos especializamos en proyectos de infraestructura, edificación residencial y comercial, siempre garantizando calidad y sostenibilidad.', nif: 'D34567890'
  },
  {
    name: 'Tech Solutions', email: 'info@techsolutions.com', telephone: '123-456-7890', address: 'Calle 123',
    city: 'Sevilla', zipCode: '28001', imageUrl: 'https://purina.com.sv/sites/default/files/2024-04/razas-de-perros-grandes-labrador-sv.jpg',
    description: 'Tech Solutions es una empresa líder en innovación tecnológica, ofreciendo soluciones de software, infraestructura en la nube y ciberseguridad. Con más de 15 años de experiencia, trabajamos con clientes de diversos sectores para mejorar su eficiencia y productividad mediante tecnología de vanguardia.', nif: 'A12345678'
  },
  {
    name: 'Eco Energy', email: 'contact@ecoenergy.com', telephone: '987-654-3210', address: 'Avenida Verde',
    city: 'Sevilla', zipCode: '28001', imageUrl: 'https://purina.com.sv/sites/default/files/2024-04/razas-de-perros-grandes-labrador-sv.jpg',
    description: 'Eco Energy se especializa en energía renovable, ofreciendo soluciones solares y eólicas para empresas y hogares. Nuestra misión es reducir la huella de carbono y promover un mundo más sostenible con tecnología avanzada y accesible.', nif: 'B87654321'
  },
  {
    name: 'HealthFirst', email: 'support@healthfirst.com', telephone: '654-321-0987', address: 'Plaza Salud',
    city: 'Madrid', zipCode: '28001', imageUrl: 'https://purina.com.sv/sites/default/files/2024-04/razas-de-perros-grandes-labrador-sv.jpg',
    description: 'HealthFirst ofrece servicios médicos y salud digital, brindando atención personalizada y tecnología avanzada para mejorar la calidad de vida de nuestros pacientes. Contamos con un equipo de especialistas y una red de clínicas en todo el país.', nif: 'C23456789'
  },
  {
    name: 'BuildCorp', email: 'contact@buildcorp.com', telephone: '321-654-9870', address: 'Calle Obra',
    city: 'Madrid', zipCode: '28001', imageUrl: 'https://purina.com.sv/sites/default/files/2024-04/razas-de-perros-grandes-labrador-sv.jpg',
    description: 'BuildCorp es una empresa de construcción con más de 20 años de experiencia en el sector. Nos especializamos en proyectos de infraestructura, edificación residencial y comercial, siempre garantizando calidad y sostenibilidad.', nif: 'D34567890'
  },
  {
    name: 'Tech Solutions', email: 'info@techsolutions.com', telephone: '123-456-7890', address: 'Calle 123',
    city: 'Madrid', zipCode: '28001', imageUrl: 'https://purina.com.sv/sites/default/files/2024-04/razas-de-perros-grandes-labrador-sv.jpg',
    description: 'Tech Solutions es una empresa líder en innovación tecnológica, ofreciendo soluciones de software, infraestructura en la nube y ciberseguridad. Con más de 15 años de experiencia, trabajamos con clientes de diversos sectores para mejorar su eficiencia y productividad mediante tecnología de vanguardia.', nif: 'A12345678'
  },
  {
    name: 'Eco Energy', email: 'contact@ecoenergy.com', telephone: '987-654-3210', address: 'Avenida Verde',
    city: 'Madrid', zipCode: '28001', imageUrl: 'https://purina.com.sv/sites/default/files/2024-04/razas-de-perros-grandes-labrador-sv.jpg',
    description: 'Eco Energy se especializa en energía renovable, ofreciendo soluciones solares y eólicas para empresas y hogares. Nuestra misión es reducir la huella de carbono y promover un mundo más sostenible con tecnología avanzada y accesible.', nif: 'B87654321'
  },
  {
    name: 'HealthFirst', email: 'support@healthfirst.com', telephone: '654-321-0987', address: 'Plaza Salud',
    city: 'Madrid', zipCode: '28001', imageUrl: 'https://purina.com.sv/sites/default/files/2024-04/razas-de-perros-grandes-labrador-sv.jpg',
    description: 'HealthFirst ofrece servicios médicos y salud digital, brindando atención personalizada y tecnología avanzada para mejorar la calidad de vida de nuestros pacientes. Contamos con un equipo de especialistas y una red de clínicas en todo el país.', nif: 'C23456789'
  },
  {
    name: 'BuildCorp', email: 'contact@buildcorp.com', telephone: '321-654-9870', address: 'Calle Obra',
    city: 'Madrid', zipCode: '28001', imageUrl: 'https://purina.com.sv/sites/default/files/2024-04/razas-de-perros-grandes-labrador-sv.jpg',
    description: 'BuildCorp es una empresa de construcción con más de 20 años de experiencia en el sector. Nos especializamos en proyectos de infraestructura, edificación residencial y comercial, siempre garantizando calidad y sostenibilidad.', nif: 'D34567890'
  },
  {
    name: 'Tech Solutions', email: 'info@techsolutions.com', telephone: '123-456-7890', address: 'Calle 123',
    city: 'Madrid', zipCode: '28001', imageUrl: 'https://purina.com.sv/sites/default/files/2024-04/razas-de-perros-grandes-labrador-sv.jpg',
    description: 'Tech Solutions es una empresa líder en innovación tecnológica, ofreciendo soluciones de software, infraestructura en la nube y ciberseguridad. Con más de 15 años de experiencia, trabajamos con clientes de diversos sectores para mejorar su eficiencia y productividad mediante tecnología de vanguardia.', nif: 'A12345678'
  },
  {
    name: 'Eco Energy', email: 'contact@ecoenergy.com', telephone: '987-654-3210', address: 'Avenida Verde',
    city: 'Madrid', zipCode: '28001', imageUrl: 'https://purina.com.sv/sites/default/files/2024-04/razas-de-perros-grandes-labrador-sv.jpg',
    description: 'Eco Energy se especializa en energía renovable, ofreciendo soluciones solares y eólicas para empresas y hogares. Nuestra misión es reducir la huella de carbono y promover un mundo más sostenible con tecnología avanzada y accesible.', nif: 'B87654321'
  },
  {
    name: 'HealthFirst', email: 'support@healthfirst.com', telephone: '654-321-0987', address: 'Plaza Salud',
    city: 'Valencia', zipCode: '46003', imageUrl: 'data:image/jpeg;base64,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',
    description: 'HealthFirst ofrece servicios médicos y salud digital, brindando atención personalizada y tecnología avanzada para mejorar la calidad de vida de nuestros pacientes. Contamos con un equipo de especialistas y una red de clínicas en todo el país.', nif: 'C23456789'
  },
  {
    name: 'BuildCorp', email: 'contact@buildcorp.com', telephone: '321-654-9870', address: 'Calle Obra',
    city: 'Sevilla', zipCode: '41004', imageUrl: 'data:image/jpeg;base64,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',
    description: 'BuildCorp es una empresa de construcción con más de 20 años de experiencia en el sector. Nos especializamos en proyectos de infraestructura, edificación residencial y comercial, siempre garantizando calidad y sostenibilidad.', nif: 'D34567890'
  }
];

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

function TabTwoScreen() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        setSponsors(fallbackSponsors);
        /*const authToken = await AsyncStorage.getItem('authToken');
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
        setSponsors(data);*/
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

export default withAuth(TabTwoScreen, [AUTHORITIES.ADMIN, AUTHORITIES.CUSTOMER, AUTHORITIES.COMPANY]);
