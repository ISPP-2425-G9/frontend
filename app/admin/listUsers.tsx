import { useState, useEffect,useCallback } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GlobalStyles } from '@/constants/Colors';
import { BACKEND_API } from '@/constants/Mysc';
import { AUTHORITIES } from '../_util/Authorities';
import { withAuth } from '../_util/withAuth';

function AdminListUsers() {
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

  // Ejecutar fetchData cuando se entra en la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [mostrarClientes])
  );

  const handleEdit = (id: number) => {
    navigation.navigate('admin/editUser', { userId: id, isCustomer: mostrarClientes });
  };

  const handleDelete = async () => {
    if (!selectedUserId) return;

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) throw new Error('No se encontró un token de autenticación');

      const response = await fetch(BACKEND_API + '/api/auth/admin/users/' + selectedUserId, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken.trim()}`,
        },
      });

      if (response.status === 204) {
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
          onPress={() => { setMostrarClientes(true); }}
          color={mostrarClientes ? 'blue' : 'grey'}
          style={styles.smallButton}
        />
        <CustomButton
          title="Empresas"
          onPress={() => { setMostrarClientes(false); }}
          color={!mostrarClientes ? 'blue' : 'grey'}
          style={styles.smallButton}
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
                      <CustomButton title="Editar" onPress={() => { handleEdit(item.id); }} color="blue" />
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

      <CustomModal visible={modalVisible} onClose={() => { setModalVisible(false); } } title="Confirmar Eliminación">
        <ThemedText>¿Estás seguro de que deseas eliminar este usuario?</ThemedText>
        <View style={styles.modalButtons}>
          <CustomButton title="Cancelar" onPress={() => { setModalVisible(false);} } color="grey" />
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
    marginVertical: 20,
    gap: 8,
    backgroundColor: 'transparent',
    marginBottom: 50,
  },
  smallButton: {
    width: 140,
    height: 45,
    paddingVertical: 6,
  },
  title: {
    textAlign: 'center',
    marginBottom: 0,
    fontFamily: GlobalStyles.fontBold,
    color: GlobalStyles.white,
    backgroundColor: GlobalStyles.blue,
    padding: 15
  },
  scrollContainer: {
    flexGrow: 1,
    minWidth: Dimensions.get('window').width,
    backgroundColor: 'transparent',
  },
  tableWrapper: {
    width: '100%',
    minWidth: Dimensions.get('window').width,
    backgroundColor: 'transparent',
  },
  tableBody: {
    maxHeight: 400,
    backgroundColor: 'transparent', 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: GlobalStyles.grey,
    alignItems: 'center',
    backgroundColor: GlobalStyles.lightGrey,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: GlobalStyles.font,
    color: GlobalStyles.darkGrey,
    backgroundColor: 'transparent',
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


export default withAuth(AdminListUsers, [AUTHORITIES.ADMIN]);
