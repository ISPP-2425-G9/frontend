import { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text } from 'react-native';
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
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', telephone: '600123456' },
    { id: 2, name: 'Ana García', email: 'ana@example.com', telephone: '699654321' },
    { id: 3, name: 'Carlos Ruiz', email: 'carlos@example.com', telephone: '611223344' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>Contactos de Emergencia</Text>
          <Text style={styles.introText}>
            Aquí podrás gestionar tus <Text style={styles.highlight}>contactos de emergencia</Text>,
            para que en caso de que notemos inactividad en tu cuenta, contactemos con estas personas
            para recordarles que tienes una cuenta con nosotros la cual has estado pagando y que tienes
            mensajes para enviar.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Añadir nuevo contacto"
            onPress={() => console.log("Crear nuevo contacto")}
            color="green"
          />
        </View>

        <ScrollView horizontal style={styles.horizontalScroll}>
          <View style={styles.tableWrapper}>
            <CustomTable
              columns={['NOMBRE', 'EMAIL', 'TELÉFONO', 'ACCIONES']}
              columnWidths={[1.2, 1.1, 1.05, 1.2]}
            >
              {contacts.map((contact) => (
                <View key={contact.id} style={styles.row}>
                  <ThemedText style={styles.cell}>{contact.name}</ThemedText>
                  <ThemedText style={styles.cell}>{contact.email}</ThemedText>
                  <ThemedText style={styles.cell}>{contact.telephone}</ThemedText>
                  <View style={styles.actions}>
                    <CustomButton title="Editar" onPress={() => console.log("Editar contacto")} color="blue" />
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
            </CustomTable>
          </View>
        </ScrollView>

        <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)} title="Confirmar Eliminación">
          <ThemedText>¿Estás seguro de que deseas eliminar este contacto?</ThemedText>
          <View style={styles.modalButtons}>
            <CustomButton title="Cancelar" onPress={() => setModalVisible(false)} color="grey" />
            <CustomButton
              title="Eliminar"
              onPress={() => {
                console.log("Eliminar contacto");
                // Aquí iría la lógica real de eliminación
                //setContacts(prev => prev.filter(c => c.id !== selectedContactId));
                setModalVisible(false);
              }}
              color="red"
            />
          </View>
        </CustomModal>
      </ScrollView>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: GlobalStyles.white,
    paddingTop: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
    alignItems: 'center',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: GlobalStyles.darkGrey,
    marginBottom: 10,
    textAlign: 'center',
  },
  introText: {
    fontSize: 18,
    color: GlobalStyles.darkGrey,
    textAlign: 'center',
    lineHeight: 22,
  },
  highlight: {
    fontWeight: 'bold',
    color: GlobalStyles.blue,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  horizontalScroll: {
    width: '100%',
  },
  tableWrapper: {
    width: '100%',
    minWidth: Dimensions.get('window').width,
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
