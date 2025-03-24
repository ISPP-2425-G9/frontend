import { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import { GlobalStyles } from '@/constants/Colors';


type EmergencyContact = {
  id: number;
  name: string;
  email: string;
  telephone: string;
};

function EmergencyContactScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([  // contactos de emergencia inventados, debería de hacerse una petición al backend
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', telephone: '600123456' },
    { id: 2, name: 'Ana García', email: 'ana@example.com', telephone: '699654321' },
    { id: 3, name: 'Carlos Ruiz', email: 'carlos@example.com', telephone: '611223344' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>Contactos de Emergencia</ThemedText>

      <ThemedView style={styles.buttonContainer}>
        <CustomButton title="Añadir nuevo contacto" onPress={() => {console.log("Crear nuevo contacto")}} color="green" /> {/* TODO: lógica que implementar */}
      </ThemedView>

      <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
        <View style={styles.tableWrapper}>
          <CustomTable
            columns={['NOMBRE', 'EMAIL', 'TELÉFONO', 'ACCIONES']}
            columnWidths={[1.2, 1.1, 1.05, 1.2]}
          >
            <ScrollView style={styles.tableBody}>
              {contacts.map((contact) => (
                <View key={contact.id} style={styles.row}>
                  <ThemedText style={styles.cell}>{contact.name}</ThemedText>
                  <ThemedText style={styles.cell}>{contact.email}</ThemedText>
                  <ThemedText style={styles.cell}>{contact.telephone}</ThemedText>
                  <View style={styles.actions}>
                    <CustomButton title="Editar" onPress={() => {console.log("Editar contacto")}} color="blue" /> {/* TODO: lógica que implementar */}
                    <CustomButton
                      title="Eliminar"
                      onPress={() => {
                        setSelectedContactId(contact.id);
                        setModalVisible(true);
                      }}
                      color="red"
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
          </CustomTable>
        </View>
      </ScrollView>

      <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)} title="Confirmar Eliminación">
        <ThemedText>¿Estás seguro de que deseas eliminar este contacto?</ThemedText>
        <View style={styles.modalButtons}>
          <CustomButton title="Cancelar" onPress={() => setModalVisible(false)} color="grey" />
          <CustomButton title="Eliminar" onPress={() => {
            console.log("Eliminar contacto")
            // TODO: Aquí iría la lógica real de eliminación
            // setContacts(prev => prev.filter(c => c.id !== selectedContactId));
            setModalVisible(false);
          }} color="red" />
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
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: GlobalStyles.fontBold,
    color: GlobalStyles.white,
    backgroundColor: GlobalStyles.blue,
    padding: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginVertical: 15,
    backgroundColor: GlobalStyles.white,
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
    backgroundColor: GlobalStyles.lightGrey,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
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

export default withAuth(EmergencyContactScreen, [AUTHORITIES.CUSTOMER_PREMIUM]);
