import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';


export default function EditUserScreen() {
  const route = useRoute();
  const { userId, isCustomer } = route.params as { userId: number; isCustomer: boolean };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar {isCustomer ? 'Cliente' : 'Empresa'}</Text>
      <Text style={styles.info}>ID del usuario: {userId}</Text>
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
});
