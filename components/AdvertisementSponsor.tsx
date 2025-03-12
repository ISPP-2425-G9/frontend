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

  return (
    <View style={[styles.sponsorCard, isMobile ? styles.mobileLayout : styles.desktopLayout]}>
      <Image source={{ uri: sponsor.imageUrl }} style={[styles.image, isMobile ? styles.imageMobile : styles.imageDesktop]} />
      <View style={styles.infoContainer}>
        <Text style={styles.sponsorName}>{sponsor.name}</Text>
        <Text style={styles.sponsorText}>📧 {sponsor.email}</Text>
        <Text style={styles.sponsorText}>📞 {sponsor.telephone}</Text>
        <Text style={styles.sponsorText}>📍 {sponsor.address}, {sponsor.city}, {sponsor.zipCode}</Text>
        <Text style={styles.sponsorText}>🆔 NIF: {sponsor.nif}</Text>
        <Text style={styles.sponsorDescription}>{sponsor.description}</Text>
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
    width: '90%',
    alignSelf: 'stretch',
    minHeight: 200,
    display: 'flex',
    justifyContent: 'center',
  },
  desktopLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 600,
  },
  mobileLayout: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    borderRadius: 8,
  },
  imageDesktop: {
    width: 150,
    height: 150,
    marginRight: 15,
  },
  imageMobile: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  infoContainer: {
    flex: 1,
    width: '100%',
  },
  sponsorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GlobalStyles.grey,
    marginBottom: 5,
    textAlign: 'center',
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
    marginTop: 5,
    textAlign: 'justify',
    flexWrap: 'wrap',
    overflow: 'hidden',
    width: '100%',
  },
  listContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});

export default AdvertisementSponsor;
