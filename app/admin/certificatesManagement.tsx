import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';
import { GlobalStyles } from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';
import { ThemedText } from '@/components/ThemedText';
import CustomModal from '@/components/CustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_API } from '@/constants/Mysc';


type Certificate = {
  id: number;
  name: string;
  dni: string;
  certificateUrl: string;
};

const CertificateManagement: React.FC = () => {
  const navigation = useNavigation();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [deathDates, setDeathDates] = useState<{ [id: number]: string }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCertificateId, setSelectedCertificateId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [failureMessage, setFailureMessage] = useState<string>("");

  const isValidDeathDate = (dateStr: string): { valid: boolean; message?: string } => {
    if (!dateStr) {
      return { valid: false, message: "Debes introducir una fecha." };
    }

    const enteredDate = new Date(dateStr);
    if (isNaN(enteredDate.getTime())) {
      return { valid: false, message: "La fecha introducida no es válida." };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (enteredDate > today) {
      return { valid: false, message: "La fecha debe ser igual o anterior al día de hoy." };
    }
    return { valid: true };
  };
  
  const showSuccessMessage = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showFailureMessage = (msg: string) => {
    setFailureMessage(msg);
    setTimeout(() => setFailureMessage(""), 3000);
  };

  const fetchCertificates = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) throw new Error('Token no disponible');
  
      const response = await fetch(`${BACKEND_API}/api/admin/certificates/pending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken.trim()}`,
        },
      });
  
      if (!response.ok) throw new Error('Error al obtener certificados');
  
      const data = await response.json();
      setCertificates(data);
    } catch (error) {
      const error_str = 'Error al obtener certificados:' + error;
      showFailureMessage(error_str);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      fetchCertificates();
    }, [])
  );

  const renderItem = ({ item }: { item: Certificate }) => (
    <View style={styles.tableRow}>
      <View style={styles.cell}><Text style={styles.cellText}>{item.name}</Text></View>
      <View style={styles.cell}><Text style={styles.cellText}>{item.dni}</Text></View>
      <View style={styles.cell}>
        <CustomButton
          title="Ver certificado"
          color="blue"
          style={styles.deathCertificateButton}
          onPress={() => navigation.navigate('admin/certificateViewer', { certificateUrl: item.certificateUrl })}
        />
      </View>
      <View style={styles.cell}>
        <CustomButton
          title="Revisar esquelas/mensajes"
          color="blue"
          style={styles.obituariesMessagesButton}
          onPress={() => navigation.navigate('admin/reviewObituariesAndMessages', { certificateId: item.id })}
        />
      </View>
      <View style={styles.cell}>
        <TextInput
          placeholder="aaaa-mm-dd"
          value={deathDates[item.id] || ''}
          onChangeText={(text) => {
            setErrorMessage("");
            setDeathDates((prev) => ({ ...prev, [item.id]: text }));
          }}
          style={styles.dateInput}
        />
      </View>
      <View style={styles.cell}>
        <View style={styles.actionButtonsContainer}>
          <CustomButton
            title="Aceptar"
            color="green"
            style={styles.actionsButton}
            onPress={async () => {
              setErrorMessage("");
              const dateStr = deathDates[item.id];
              const { valid, message } = isValidDeathDate(dateStr);
              if (!valid) {
                setErrorMessage(message || "");
                return;
              }
              try {
                const authToken = await AsyncStorage.getItem('authToken');
                const response = await fetch(`${BACKEND_API}/api/admin/certificates/approve/${item.id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                  },
                  body: JSON.stringify({ deathDate: dateStr }),
                });
  
                if (response.ok) {
                  showSuccessMessage(`Certificado aprobado correctamente.`);
                  fetchCertificates();
                } else {
                  showFailureMessage('Error al aprobar el certificado');
                }
              } catch (error) {
                const error_str = 'Error de red al aprobar el certificado:' + error;
                showFailureMessage(error_str);
              }
            }}
          />
          <CustomButton
            title="Denegar"
            color="red"
            style={styles.actionsButton}
            onPress={() => {
              setErrorMessage("");
              setSelectedCertificateId(item.id);
              setModalVisible(true);
            }}
          />
        </View>
      </View>
    </View>
  );
  
  
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>Certificados de defunción</Text>
          <Text style={styles.introText}>
            A continuación se muestra un listado de los <Text style={styles.highlight}>certificados de defunción</Text> del sistema
            que aún no han sido valorados.
          </Text>
        </View>
        {successMessage !== "" && (
          <ThemedText style={styles.successMessage}>{successMessage}</ThemedText>
        )}
        {failureMessage !== "" && (
          <ThemedText style={styles.failureMessage}>{failureMessage}</ThemedText>
        )}
        {errorMessage !== "" && (
          <ThemedText style={styles.errorMessage}>{errorMessage}</ThemedText>
        )}
        {certificates.length === 0 ? (
          <ThemedText style={styles.noDataText}>No hay certificados pendientes.</ThemedText>
        ) : (
          <View style={styles.tableContainer}>
            <ScrollView
              horizontal
              style={styles.tableScrollContainer}
              contentContainerStyle={styles.tableScrollContent}
            >
              <View style={styles.tableWrapper}>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerCell}>Nombre</Text>
                  <Text style={styles.headerCell}>DNI</Text>
                  <Text style={styles.headerCell}>Certificado</Text>
                  <Text style={styles.headerCell}>Esquelas/Mensajes</Text>
                  <Text style={styles.headerCell}>Fecha fallecimiento</Text>
                  <Text style={styles.headerCell}>Acciones</Text>
                </View>
                <FlatList
                  data={certificates}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderItem}
                />
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {modalVisible && (
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Confirmar denegación"
        >
          <ThemedText>¿Estás seguro de que deseas denegar este certificado?</ThemedText>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 10 }}>
            <CustomButton title="Cancelar" color="grey" onPress={() => setModalVisible(false)} />
            <CustomButton
              title="Denegar"
              color="red"
              onPress={async () => {
                if (selectedCertificateId !== null) {
                  try {
                    const authToken = await AsyncStorage.getItem('authToken');
                    const response = await fetch(`${BACKEND_API}/api/admin/certificates/disapprove/${selectedCertificateId}`, {
                      method: 'DELETE',
                      headers: {
                        Authorization: `Bearer ${authToken}`,
                      },
                    });
        
                    if (response.ok) {
                      showSuccessMessage(`Certificado denegado correctamente.`);
                      setModalVisible(false);
                      fetchCertificates();
                    } else {
                      showFailureMessage('Error al denegar el certificado');
                    }
                  } catch (error) {
                    const error_str = 'Error de red al denegar el certificado:' + error;
                    showFailureMessage(error_str);
                  }
                }
              }}
            />
          </View>
        </CustomModal>      
      )}
    </ThemedView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.white,
    paddingTop: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 10,
  },
  introContainer: {
    width: '90%',
    backgroundColor: GlobalStyles.lightGrey,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
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
  tableContainer: {
    width: '100%',
    marginTop: 10,
    alignSelf: 'center',
  },
  tableScrollContent: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  tableWrapper: {
    alignSelf: 'center',
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
    minWidth: 220,
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
    minWidth: 200,
    alignItems: 'center',
    paddingVertical: 10,
  },
  cellText: {
    textAlign: 'center',
    fontSize: 16,
  },
  deathCertificateButton: {
    alignSelf: 'center',
    width: 120,
  },
  obituariesMessagesButton: {
    alignSelf: 'center',
    width: 150,
  },
  actionsButton: {
    alignSelf: 'center',
    width: 100,
  },
  tableScrollContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 120,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
    color: GlobalStyles.blue,
    marginTop: 20,
  },
  successMessage: {
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },  
  failureMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  }, 
});

export default withAuth(CertificateManagement, [AUTHORITIES.ADMIN]);
