import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { View, Image, StyleSheet, Text } from 'react-native';
import React from 'react';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';
import CustomButton from '@/components/CustomButton';
import { GlobalStyles } from '@/constants/Colors';


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
        <CustomButton title="Volver al listado" onPress={() => navigation.navigate('admin/certificatesManagement')} color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: certificateUrl,
          cache: 'force-cache',
        }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.backButton}>
        <CustomButton title="Volver al listado" onPress={() => navigation.navigate('admin/certificatesManagement')} color="blue" />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default withAuth(CertificateViewer, [AUTHORITIES.ADMIN]);
