import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GlobalStyles } from '@/constants/Colors';
import { BACKEND_API } from '@/constants/Mysc';

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
  }, [mostrarClientes]); // Se ejecuta cada vez que cambia entre Clientes/Empresas

  return (
    <ParallaxScrollView headerBackgroundColor={GlobalStyles.white}>
      {/* Contenedor de botones centrados */}
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, mostrarClientes ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setMostrarClientes(true)}
        >
          <Text style={[styles.buttonText, mostrarClientes ? styles.activeButtonText : styles.inactiveButtonText]}>
            Clientes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !mostrarClientes ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setMostrarClientes(false)}
        >
          <Text style={[styles.buttonText, !mostrarClientes ? styles.activeButtonText : styles.inactiveButtonText]}>
            Empresas
          </Text>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView>
        <ThemedText type="title" style={styles.title}>
          {mostrarClientes ? 'Lista de Clientes' : 'Lista de Empresas'}
        </ThemedText>

        {loading ? (
          <ActivityIndicator size="large" color={GlobalStyles.blue} />
        ) : (
          <FlatList
            data={mostrarClientes ? clientes : empresas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.email}</Text>
                <Text style={styles.cell}>{mostrarClientes ? item.dni : item.nif}</Text>
                <Text style={styles.cell}>{item.telephone}</Text>
              </View>
            )}
            ListHeaderComponent={() => (
              <View style={styles.headerRow}>
                <Text style={styles.headerCell}>Nombre</Text>
                <Text style={styles.headerCell}>Email</Text>
                <Text style={styles.headerCell}>{mostrarClientes ? 'DNI' : 'NIF'}</Text>
                <Text style={styles.headerCell}>Teléfono</Text>
              </View>
            )}
          />
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  activeButton: {
    backgroundColor: GlobalStyles.darkGrey,
  },
  inactiveButton: {
    backgroundColor: GlobalStyles.lightGrey,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: GlobalStyles.fontBold,
  },
  activeButtonText: {
    color: GlobalStyles.white,
  },
  inactiveButtonText: {
    color: GlobalStyles.grey,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: GlobalStyles.fontBold,
    color: GlobalStyles.darkGrey,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: GlobalStyles.darkGrey,
    backgroundColor: GlobalStyles.lightGrey,
  },
  headerCell: {
    fontSize: 16,
    fontFamily: GlobalStyles.fontBold,
    color: GlobalStyles.darkGrey,
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: GlobalStyles.grey,
  },
  cell: {
    fontSize: 16,
    fontFamily: GlobalStyles.font,
    color: GlobalStyles.darkGrey,
    flex: 1,
    textAlign: 'center',
  },
});
