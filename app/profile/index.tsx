import { View, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import LogoutButton from '@/components/LogoutButton';
import DeleteAccountButton from '@/components/DeleteAccountButton';

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Mi Perfil</ThemedText>
      
      {/* Contenido del perfil aquí */}
      
      <View style={styles.buttonContainer}>
        <LogoutButton />
        <DeleteAccountButton />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 'auto',
    marginBottom: 20,
  },
}); 