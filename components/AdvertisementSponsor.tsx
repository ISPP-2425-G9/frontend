import { StyleSheet, Text, View, Image, useWindowDimensions } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';


type SponsorProps = {
  sponsor: {
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
};

const AdvertisementSponsor: React.FC<SponsorProps> = ({ sponsor }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  };
  
  return (
    <View style={[styles.sponsorCard, isMobile ? styles.mobileLayout : styles.desktopLayout]}>
      <Image testID="sponsor-image" source={{ uri: sponsor.imageUrl }} style={[styles.image, isMobile ? styles.imageMobile : styles.imageDesktop]} />
      <View style={styles.infoContainer}>
        <Text style={styles.sponsorName}>{sponsor.name}</Text>
        <Text style={styles.descriptionTitle}>¿Quiénes somos?</Text>
        <Text style={styles.sponsorDescription}>{sponsor.description}</Text>
        <Text style={styles.descriptionTitle}>Contacto:</Text>
        <Text style={styles.sponsorText}>📞 {formatPhoneNumber(sponsor.telephone)}</Text>
        <Text style={styles.sponsorText}>✉️ {sponsor.email}</Text>
        <Text style={styles.descriptionTitle}>Dirección:</Text>
        <Text style={styles.sponsorText}>📍 {sponsor.address}, {sponsor.city}, {sponsor.zipCode}</Text>
        <Text style={styles.descriptionTitle}>Información adicional:</Text>
        <Text style={styles.sponsorText}>🆔 NIF: {sponsor.nif}</Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  sponsorCard: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: GlobalStyles.lightGrey,
    width: '100%',
    alignSelf: 'stretch',
    minHeight: 200,
    display: 'flex',
    justifyContent: 'center',
  },
  desktopLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileLayout: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    borderRadius: 8,
  },
  imageDesktop: {
    width: 175,
    height: 210,
    marginRight: 15,
  },
  imageMobile: {
    width: 165,
    height: 130,
    marginBottom: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  sponsorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GlobalStyles.grey,
    marginBottom: 5,
    textAlign: 'center',
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: GlobalStyles.grey,
    textAlign: 'center',
    marginTop: 10,
  },
  sponsorText: {
    fontSize: 14,
    color: GlobalStyles.darkGrey,
    marginBottom: 3,
    textAlign: 'center',
  },
  sponsorDescription: {
    fontSize: 14,
    color: GlobalStyles.darkGrey,
    marginTop: 3,
    marginBottom: 5,
    textAlign: 'justify',
    flexWrap: 'wrap',
    overflow: 'hidden',
    width: '100%',
  },
});

export default AdvertisementSponsor;
