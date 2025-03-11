import { StyleSheet, Text, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import LogoutButton from '@/components/LogoutButton';
import DeleteAccountButton from '@/components/DeleteAccountButton';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';

function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Mi perfil</Text>
      
      {/* Profile content here */}
      <Text>El contenido del perfil no está disponible aún</Text>

      <View style={styles.buttonContainer}>
        <LogoutButton />
        <DeleteAccountButton />
      </View>
    </ThemedView>
  );

}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flex: 1,
    alignItems: 'center',
    paddingTop: 120,
    backgroundColor: '#ffff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  listContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  obituaryCard: {
    padding: 10,
    margin: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 'auto',
    marginBottom: 20,
  },
});

export default withAuth(ProfileScreen, [AUTHORITIES.CUSTOMER, AUTHORITIES.COMPANY, AUTHORITIES.ADMIN])