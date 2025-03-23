import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, Dimensions } from 'react-native';
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
  const [fechaExpiracion, setFechaExpiracion] = useState<string | null>(null);

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
        if (foundRole.includes('PREMIUM')) {
          setFechaExpiracion('2024-04-15');   // TODO: Pasar la fecha de pago desde el backend
        }
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
        <View style={[styles.planContainer]}>
          {role && user?.id && <PlanCard userId={user.id} role={role} fechaExpiracion={fechaExpiracion || undefined} />}
        </View>
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
    paddingBottom: 20,
  },
  planContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withAuth(PlanManagementView, [AUTHORITIES.CUSTOMER, AUTHORITIES.COMPANY]);
