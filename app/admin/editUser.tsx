import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';

function EditUserScreen() {
  const route = useRoute();
  const params = route.params as { userId?: number; isCustomer?: boolean } | undefined;

  if (!params || params.userId === undefined || params.isCustomer === undefined) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: No se proporcionaron los datos del usuario.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar {params.isCustomer ? 'Cliente' : 'Empresa'}</Text>
      <Text style={styles.info}>ID del usuario: {params.userId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
});

export default withAuth(EditUserScreen, [AUTHORITIES.ADMIN])