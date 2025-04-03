import PlanCard from '@/components/PlanCard';
import { ThemedView } from '@/components/ThemedView';
import { GlobalStyles } from '@/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AUTHORITIES, AuthorityType } from '../_util/Authorities';
import { withAuth } from '../_util/withAuth';
import useAuth from '@/hooks/useAuth';

const VALID_ROLES: string[] = ['CUSTOMER_FREE', 'CUSTOMER_PREMIUM', 'COMPANY_FREE', 'COMPANY_PREMIUM'];

function PlanManagementView() {
  const { roles, experedPlanDate } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [fechaExpiracion, setFechaExpiracion] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const rolesUser = roles ?? [AUTHORITIES.ANONYMOUS];
      const foundRole = rolesUser.find((r: string) => VALID_ROLES.includes(r)) ?? null;
      setRole(foundRole);
      const experedPlanDateStr = experedPlanDate?.toLocaleDateString("es-ES") ?? null
      setFechaExpiracion(experedPlanDateStr); // TODO: Obtener fecha del backend
    };
    fetchUser();
  }, [roles]);

  useFocusEffect(
    useCallback(() => {
      document.title = 'Planes'; // Esto solo aplica si se ejecuta en Web
    }, [])
  );

  if (!role) return <Text>Cargando...</Text>;

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Gestión de planes</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.planContainer}>
          <PlanCard role={role} fechaExpiracion={fechaExpiracion ?? undefined} />
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
    paddingTop: 20,
    backgroundColor: GlobalStyles.white,
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
