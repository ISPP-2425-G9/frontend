import { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GlobalStyles } from '@/constants/Colors';
import { BACKEND_API } from '@/constants/Mysc';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';

export default function TabTwoScreen() {
  const [mostrarClientes, setMostrarClientes] = useState(true);

  type Cliente = {
    id: number;
    name: string;
    email: string;
    dni: string;
    telephone: string;
  };

  type Empresa = {
    id: number;
    name: string;
    email: string;
    nif: string;
    telephone: string;
  };

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) throw new Error('No se encontró un token de autenticación');

        const endpoint = mostrarClientes ? 'customers' : 'companies';
        const response = await fetch(BACKEND_API+'/api/auth/admin/'+endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken.trim()}`,
          },
        });

        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);

        const data = await response.json();
        if (mostrarClientes) {
          setClientes(data);
        } else {
          setEmpresas(data);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mostrarClientes]);

  const handleEdit = (id: number) => {
    console.log(`Editar ${mostrarClientes ? 'cliente' : 'empresa'} con ID:`, id);
  };

  const handleDelete = (id: number) => {
    console.log(`Eliminar ${mostrarClientes ? 'cliente' : 'empresa'} con ID:`, id);
  };

  return (
    <View style={styles.container}>
      <ThemedView style={styles.buttonContainer}>
        <CustomButton
          title="Clientes"
          onPress={() => setMostrarClientes(true)}
          color={mostrarClientes ? 'blue' : 'grey'}
        />
        <CustomButton
          title="Empresas"
          onPress={() => setMostrarClientes(false)}
          color={!mostrarClientes ? 'blue' : 'grey'}
        />
      </ThemedView>

      <ThemedView>
        <ThemedText type="title" style={styles.title}>
          {mostrarClientes ? 'Lista de Clientes' : 'Lista de Empresas'}
        </ThemedText>

        {loading ? (
          <ActivityIndicator size="large" color={GlobalStyles.blue} />
        ) : (
          <CustomTable columns={['Nombre', 'Email', mostrarClientes ? 'DNI' : 'NIF', 'Teléfono', 'Acciones']}>
            {(mostrarClientes ? clientes : empresas).map((item) => (
              <View key={item.id} style={styles.row}>
                <ThemedText style={styles.cell}>{item.name}</ThemedText>
                <ThemedText style={styles.cell}>{item.email}</ThemedText>
                <ThemedText style={styles.cell}>{mostrarClientes ? (item as Cliente).dni : (item as Empresa).nif}</ThemedText>
                <ThemedText style={styles.cell}>{item.telephone}</ThemedText>
                <View style={styles.actions}>
                  <CustomButton title="Editar" onPress={() => handleEdit(item.id)} color="blue" />
                  <CustomButton title="Eliminar" onPress={() => handleDelete(item.id)} color="red" />
                </View>
              </View>
            ))}
          </CustomTable>
        )}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 120,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    gap: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: GlobalStyles.fontBold,
    color: GlobalStyles.darkGrey,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: GlobalStyles.grey,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: GlobalStyles.font,
    color: GlobalStyles.darkGrey,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
});
