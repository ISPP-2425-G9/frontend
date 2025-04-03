import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'; 
import { View, Image, StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';
import CustomButton from '@/components/CustomButton';
import { GlobalStyles } from '@/constants/Colors';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

type RouteParams = {
  CertificateViewer: {
    certificateUrl: string;
  };
};

function CertificateViewer() {
  const route = useRoute<RouteProp<RouteParams, 'CertificateViewer'>>();
  const navigation = useNavigation();
  const { certificateUrl } = route.params ?? {};

  if (!certificateUrl) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No se encontró el certificado.</Text>
        <CustomButton
          title="Volver al listado"
          onPress={() => navigation.navigate('admin/certificatesManagement')}
          color="blue"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <CustomButton
          title="Volver al listado"
          onPress={() => navigation.navigate('admin/certificatesManagement')}
          color="blue"
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: certificateUrl, cache: 'force-cache' }}
          style={styles.image}
          resizeMode="contain"
        />
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.white,
    alignItems: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 40,
  },
  message: {
    color: 'black',
    fontSize: 18,
    marginBottom: 20,
  },
  image: {
    width: screenWidth * 0.9,
    height: screenHeight * 1.5,
    resizeMode: 'contain',
  },
  backButton: {
    marginTop: 20,
    marginBottom: 10,
  },
});

export default withAuth(CertificateViewer, [AUTHORITIES.ADMIN]);
