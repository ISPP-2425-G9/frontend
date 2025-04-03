import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';
import { GlobalStyles } from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';
import { ThemedText } from '@/components/ThemedText';


type Certificate = {
  id: number;
  name: string;
  dni: string;
  certificateUrl: string;
};

const MOCK_DATA: Certificate[] = [
  {
    id: 1,
    name: 'Juan Pérez García',
    dni: '12345678A',
    certificateUrl: 'https://static.nationalgeographicla.com/files/styles/image_3200/public/comedy-wildlife-awards-squirel-stop.jpg',
  },
  {
    id: 2,
    name: 'María López Sánchez',
    dni: '12345678A',
    certificateUrl: 'https://static.nationalgeographicla.com/files/styles/image_3200/public/comedy-wildlife-awards-squirel-stop.jpg',
  },
  {
    id: 3,
    name: 'Pepa López Juárez',
    dni: '12345678A',
    certificateUrl: 'https://static.nationalgeographicla.com/files/styles/image_3200/public/comedy-wildlife-awards-squirel-stop.jpg',
  },
  {
    id: 4,
    name: 'María Isabel López Sánchez',
    dni: '12345678A',
    certificateUrl: 'https://static.nationalgeographicla.com/files/styles/image_3200/public/comedy-wildlife-awards-squirel-stop.jpg',
  },
  {
    id: 5,
    name: 'Antonio López Sanchis',
    dni: '12345678A',
    certificateUrl: 'https://static.nationalgeographicla.com/files/styles/image_3200/public/comedy-wildlife-awards-squirel-stop.jpg',
  },
  {
    id: 6,
    name: 'Juan Antonio Pérez Sánchez',
    dni: '12345678A',
    certificateUrl: 'https://static.nationalgeographicla.com/files/styles/image_3200/public/comedy-wildlife-awards-squirel-stop.jpg',
  },
];


const CertificateManagement: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [deathDates, setDeathDates] = useState<{ [id: number]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigation = useNavigation();

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
  

  useEffect(() => {
    // Simulación de carga desde el backend
    setCertificates(MOCK_DATA);
  }, []);

  const renderItem = ({ item }: { item: Certificate }) => (
    <View style={styles.tableRow}>
      <View style={styles.cell}><Text style={styles.cellText}>{item.name}</Text></View>
      <View style={styles.cell}><Text style={styles.cellText}>{item.dni}</Text></View>
      <View style={styles.cell}>
        <CustomButton
          title="Ver certificado"
          color="blue"
          style={styles.deathCertificateButton}
          onPress={() => navigation.navigate('admin/certificateViewer', {certificateUrl: item.certificateUrl,})}
        />
      </View>
      <View style={styles.cell}>
        <CustomButton
          title="Revisar esquelas/mensajes"
          color="blue"
          style={styles.obituariesMessagesButton}
          onPress={() => navigation.navigate('admin/reviewObituariesAndMessages', {certificateId: item.id,})}
        />
      </View>
      <View style={styles.cell}>
        <TextInput
          placeholder="aaaa-mm-dd"
          value={deathDates[item.id] || ''}
          onChangeText={(text) =>
            setDeathDates((prev) => ({ ...prev, [item.id]: text }))
          }
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
              const dateStr = deathDates[item.id];
              const { valid, message } = isValidDeathDate(dateStr);
              if (!valid) {
                setErrorMessage(message || "");
              } else {
                console.log(`Certificado aceptado ID: ${item.id} con fecha: ${dateStr}`);
              }
            }}
          />
          <CustomButton
            title="Denegar"
            color="red"
            style={styles.actionsButton}
            onPress={() => {
              console.log(`Certificado denegado ID: ${item.id}`);
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
        {errorMessage !== "" && (
          <ThemedText style={styles.errorMessage}>{errorMessage}</ThemedText>
        )}
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
      </ScrollView>
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
});

export default withAuth(CertificateManagement, [AUTHORITIES.ADMIN]);
