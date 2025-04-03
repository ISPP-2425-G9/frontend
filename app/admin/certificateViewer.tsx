import { RouteProp, useRoute } from '@react-navigation/native';
import { View, Image, StyleSheet } from 'react-native';
import React from 'react';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';


type RouteParams = {
  CertificateViewer: {
    certificateUrl: string;
  };
};

function CertificateViewer() {
  const route = useRoute<RouteProp<RouteParams, 'CertificateViewer'>>();
  const { certificateUrl } = route.params;

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
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default withAuth(CertificateViewer, [AUTHORITIES.ADMIN]);