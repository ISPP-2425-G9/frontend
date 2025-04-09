import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import CustomTextInput from '@/components/CustomTextInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GlobalStyles } from '@/constants/Colors';
import { BACKEND_API } from '@/constants/Mysc';
import { useNotification } from '@/context/NotificationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AUTHORITIES } from '../_util/Authorities';
import { withAuth } from '../_util/withAuth';


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
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [selectedCertificateForApproval, setSelectedCertificateForApproval] = useState<Certificate | null>(null);
  const { showNotification } = useNotification();


  const isValidDeathDate = (dateStr: string): { valid: boolean; message?: string } => {
    if (!dateStr) {
      showNotification({
        message: 'Debes introducir una fecha',
        type: 'error',
      });
      return { valid: false, message: "Debes introducir una fecha" };
    }

    const enteredDate = new Date(dateStr);
    if (isNaN(enteredDate.getTime())) {
      showNotification({
        message: 'La fecha introducida no es válida',
        type: 'error',
      });
      return { valid: false, message: "" };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (enteredDate > today) {
      showNotification({
        message: 'La fecha de fallecimiento no puede ser posterior a hoy',
        type: 'error',
      });
      return { valid: false, message: "" };
    }
    return { valid: true };
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
      showNotification({
        message: error_str,
        type: 'error',
      });
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
        <CustomTextInput
          placeholder="aaaa-mm-dd"
          maxLength={10}
          value={deathDates[item.id] || ''}
          onChangeText={(text) => {
            setErrorMessage("");
            let cleaned = text.replace(/[^0-9]/g, '');
            if (cleaned.length > 8) cleaned = cleaned.substring(0, 8);
            let formatted = cleaned;
            if (cleaned.length >= 5) {
              formatted = cleaned.substring(0, 4) + '-' + cleaned.substring(4);
              if (cleaned.length >= 7) {
                formatted = formatted.substring(0, 7) + '-' + formatted.substring(7);
              }
            }
            setDeathDates((prev) => ({ ...prev, [item.id]: formatted }));
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
            onPress={() => {
              setErrorMessage("");
              const dateStr = deathDates[item.id];
              const { valid, message } = isValidDeathDate(dateStr);
              if (!valid) {
                setErrorMessage(message || "");
                return;
              }
              setSelectedCertificateForApproval(item);
              setAcceptModalVisible(true);
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
                  <Text style={styles.headerCell}>Fecha de fallecimiento</Text>
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

      {acceptModalVisible && selectedCertificateForApproval && (
        <CustomModal
          visible={acceptModalVisible}
          onClose={() => setAcceptModalVisible(false)}
          title="Confirmar aceptación"
        >
          <ThemedText>¿Estás seguro de que deseas aceptar el certificado?</ThemedText>
          <ThemedText>Si aceptas, espera un momento ya que esta acción lleva su tiempo.</ThemedText>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 10 }}>
            <CustomButton
              title="Cancelar"
              color="grey"
              onPress={() => setAcceptModalVisible(false)}
            />
            <CustomButton
              title="Aceptar"
              color="green"
              onPress={async () => {
                const item = selectedCertificateForApproval;
                const dateStr = deathDates[item.id];
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
                    showNotification({
                      message: 'Certificado aprobado correctamente',
                      type: 'success',
                    });
                    fetchCertificates();
                  } else {
                    showNotification({
                      message: 'Error al aprobar el certificado',
                      type: 'error',
                    });
                  }
                } catch (error) {
                  showNotification({
                    message: 'Error de red al aprobar el certificado: ' + error,
                    type: 'error',
                  });
                } finally {
                  setAcceptModalVisible(false);
                  setSelectedCertificateForApproval(null);
                }
              }}
            />
          </View>
        </CustomModal>
      )}

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
                      showNotification({
                        message: 'Certificado denegado correctamente',
                        type: 'success',
                      });
                      setModalVisible(false);
                      fetchCertificates();
                    } else {
                      showNotification({
                        message: 'Error al denegar el certificado',
                        type: 'error',
                      });
                    }
                  } catch (error) {
                    const error_str = 'Error de red al denegar el certificado:' + error;
                    showNotification({
                      message: error_str,
                      type: 'error',
                    });
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
