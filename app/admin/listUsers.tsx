import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GlobalStyles } from '@/constants/Colors';
import { BACKEND_API } from '@/constants/Mysc';


export default function AdminListUsers() {
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

  const navigation = useNavigation();
  const [mostrarClientes, setMostrarClientes] = useState(true);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, [mostrarClientes]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) throw new Error('No se encontró un token de autenticación');

      const endpoint = mostrarClientes ? 'customers' : 'companies';
      const response = await fetch(BACKEND_API + '/api/auth/admin/' + endpoint, {
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

  const handleEdit = (id: number) => {
    navigation.navigate('admin/editUser', { userId: id, isCustomer: mostrarClientes });
  };

  const handleDelete = async () => {
    if (!selectedUserId) return;

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) throw new Error('No se encontró un token de autenticación');

      console.log('Eliminando usuario con ID:', selectedUserId);

      const response = await fetch(BACKEND_API + '/api/auth/admin/users/' + selectedUserId, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken.trim()}`,
        },
      });

      if (response.status === 204) {
        console.log(`Usuario con ID ${selectedUserId} eliminado exitosamente.`);
        setModalVisible(false);
        fetchData();
      } else {
        console.error('Error al eliminar usuario:', response.status);
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación:', error);
    }
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
          <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
            <View style={styles.tableWrapper}>
              <CustomTable
                columns={['NOMBRE', 'EMAIL', mostrarClientes ? 'DNI' : 'NIF', 'TELÉFONO', 'ACCIONES']}
                columnWidths={[1, 0.9, 0.9, 1, 1.2]}
              />

              <ScrollView style={styles.tableBody}>
                {(mostrarClientes ? clientes : empresas).map((item) => (
                  <View key={item.id} style={styles.row}>
                    <ThemedText style={styles.cell}>{item.name}</ThemedText>
                    <ThemedText style={styles.cell}>{item.email}</ThemedText>
                    <ThemedText style={styles.cell}>
                      {'dni' in item ? item.dni : (item as Empresa).nif}
                    </ThemedText>
                    <ThemedText style={styles.cell}>{item.telephone}</ThemedText>
                    <View style={styles.actions}>
                      <CustomButton title="Editar" onPress={() => handleEdit(item.id)} color="blue" />
                      <CustomButton
                        title="Eliminar"
                        onPress={() => {
                          setSelectedUserId(item.id);
                          setModalVisible(true);
                        }}
                        color="red"
                      />
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        )}
      </ThemedView>

      <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)} title="Confirmar Eliminación">
        <ThemedText>¿Estás seguro de que deseas eliminar este usuario?</ThemedText>
        <View style={styles.modalButtons}>
          <CustomButton title="Cancelar" onPress={() => setModalVisible(false)} color="grey" />
          <CustomButton title="Eliminar" onPress={handleDelete} color="red" />
        </View>
      </CustomModal>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 120,
    backgroundColor: GlobalStyles.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    gap: 10,
    backgroundColor: 'transparent',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: GlobalStyles.fontBold,
    color: GlobalStyles.darkGrey,
  },
  scrollContainer: {
    flexGrow: 1,
    minWidth: Dimensions.get('window').width,
  },
  tableWrapper: {
    width: '100%',
    minWidth: Dimensions.get('window').width,
  },
  tableBody: {
    maxHeight: 400,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
});
