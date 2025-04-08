import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GlobalStyles } from '@/constants/Colors';
import { BACKEND_API } from '@/constants/Mysc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Text, ScrollView, StyleSheet, View } from 'react-native';
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

  const formatPhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  };

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

  
  useFocusEffect(
    useCallback(() => {
      document.title = mostrarClientes ? 'Clientes' : 'Empresas';
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

      <View style={styles.introContainer}>
        <Text style={styles.introTitle}>{mostrarClientes ? 'Lista de clientes' : 'Lista de empresas'}</Text>
        <Text style={styles.introText}>
          A continuación se muestra un listado de los <Text style={styles.highlight}>{mostrarClientes ? 'clientes' : 'empresas'}</Text> del sistema.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={GlobalStyles.blue} />
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 10 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={styles.tableScrollContent}>
            <View style={styles.tableWrapper}>
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Nombre</Text>
                <Text style={styles.headerCell}>Email</Text>
                <Text style={styles.headerCell}>{mostrarClientes ? 'DNI' : 'NIF'}</Text>
                <Text style={styles.headerCell}>Teléfono</Text>
                <Text style={styles.headerCell}>Acciones</Text>
              </View>

              {(mostrarClientes ? clientes : empresas).map((item) => (
                <View key={item.id} style={styles.tableRow}>
                  <View style={styles.cell}><Text style={styles.cellText}>{item.name}</Text></View>
                  <View style={styles.cell}><Text style={styles.cellText}>{item.email}</Text></View>
                  <View style={styles.cell}><Text style={styles.cellText}>{'dni' in item ? item.dni : (item as Empresa).nif}</Text></View>
                  <View style={styles.cell}><Text style={styles.cellText}>{formatPhoneNumber(item.telephone)}</Text></View>
                  <View style={styles.cell}>
                    <View style={styles.actionButtonsContainer}>
                      <CustomButton title="Editar" onPress={() => handleEdit(item.id)} color="blue" style={styles.actionsButton} />
                      <CustomButton title="Eliminar" onPress={() => { setSelectedUserId(item.id); setModalVisible(true); }} color="red" style={styles.actionsButton} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      )}

      <CustomModal visible={modalVisible} onClose={() => { setModalVisible(false); } } title="Confirmar eliminación">
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
    marginTop: 10,
    backgroundColor: GlobalStyles.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    gap: 8,
    marginBottom: 30,
    backgroundColor: GlobalStyles.white,
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
    width: '100%',
    paddingHorizontal: 10,
  },
  tableWrapper: {
    alignSelf: 'center',
    minWidth: '90%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: GlobalStyles.blue,
    paddingHorizontal: 5,
    borderRadius: 8,
    minHeight: 50,
    alignItems: 'center',
  },
  headerCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    minWidth: 250,
    fontWeight: 'bold',
    color: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    minHeight: 50,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    minWidth: 200,
  },
  cellText: {
    textAlign: 'center',
    fontSize: 16,
    color: GlobalStyles.darkGrey,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsButton: {
    alignSelf: 'center',
    width: 100,
    marginHorizontal: 5,
  },
  tableBody: {
    maxHeight: 400,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  introContainer: {
    width: '90%',
    backgroundColor: GlobalStyles.lightGrey,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: GlobalStyles.darkGrey,
    marginBottom: 10,
    textAlign: 'center',
  },
  introText: {
    fontSize: 18,
    color: GlobalStyles.darkGrey,
    textAlign: 'center',
  },
  highlight: {
    color: GlobalStyles.blue,
    fontWeight: 'bold',
  },
  tableScrollContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },  
});


export default withAuth(AdminListUsers, [AUTHORITIES.ADMIN]);
