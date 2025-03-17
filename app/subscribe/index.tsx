import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES, AuthorityType } from '../_util/Authorities';
import { useAuth } from '../_util/useAuth';
import PlanCard from '@/components/PlanCard';


const VALID_ROLES: AuthorityType[] = ['CUSTOMER_FREE', 'CUSTOMER_PREMIUM', 'COMPANY_FREE', 'COMPANY_PREMIUM'];

function PlanManagementView() {
  const { user, getUserFromStorage } = useAuth();
  const [storedUser, setStoredUser] = useState(user);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'CUSTOMER_FREE' | 'CUSTOMER_PREMIUM' | 'COMPANY_FREE' | 'COMPANY_PREMIUM' | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        const storedData = await getUserFromStorage();
        setStoredUser(storedData || { roles: [AUTHORITIES.ANONYMOUS] });
      } else {
        setStoredUser(user);
      }
      setLoading(false);
    };

    fetchUser();
  }, [user]);

  useEffect(() => {
    if (storedUser && storedUser.roles) {
      const foundRole = storedUser.roles.find((r: AuthorityType) => VALID_ROLES.includes(r));
      if (foundRole) {
        setRole(foundRole as 'CUSTOMER_FREE' | 'CUSTOMER_PREMIUM' | 'COMPANY_FREE' | 'COMPANY_PREMIUM');
      }
    }
  }, [storedUser]);

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Gestión de planes</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {role && <PlanCard role={role} />} {/* PASAR LA FECHA DE PAGO */}	
      </ScrollView>
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
    width: '90%',
    alignItems: 'flex-end', 
    marginBottom: '0.5%', 
    marginRight: '6%',
  },
});

export default withAuth(PlanManagementView, [AUTHORITIES.CUSTOMER, AUTHORITIES.COMPANY]);
