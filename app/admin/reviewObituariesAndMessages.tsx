import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import CustomButton from '@/components/CustomButton';
import { ThemedView } from '@/components/ThemedView';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';
import { GlobalStyles } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_API } from '@/constants/Mysc';
import CustomModal from '@/components/CustomModal';


type RouteParams = {
  ReviewObituairesAndMessagesView: {
    certificateId: number;
  };
};

type Message = {
  id: number;
  title: string;
  body: string;
  images: string[];
};

type Obituary = {
  id: number;
  name: string;
  farewellMessage: string;
  farewellPhrase: string;
  customImage: string;
};

const screenWidth = Dimensions.get('window').width;

function ReviewObituairesAndMessagesView() {
  const route = useRoute<RouteProp<RouteParams, 'ReviewObituairesAndMessagesView'>>();
  const navigation = useNavigation();

  const certificateId = route.params?.certificateId;
  const [showMessages, setShowMessages] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [obituaries, setObituaries] = useState<Obituary[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [elementIdToDelete, setElementIdToDelete] = useState<number | null>(null);


  useEffect(() => {
    if (!certificateId) return;
  
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching data for certificate ID:', certificateId);
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) throw new Error('Token no disponible');
        
        const messagesRes = await fetch(`${BACKEND_API}/api/admin/certificates/messages/${certificateId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
  
        if (!messagesRes.ok) throw new Error('Error al cargar mensajes');
        const messagesData = await messagesRes.json();
  
        const obituariesRes = await fetch(`${BACKEND_API}/api/admin/certificates/obituaries/${certificateId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
  
        if (!obituariesRes.ok) throw new Error('Error al cargar esquelas');
        const obituariesData = await obituariesRes.json();
  
        setMessages(messagesData);
        setObituaries(obituariesData);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [certificateId]);


  if (!certificateId) {
    return (
      <ThemedView style={styles.container}>
        <Text style={styles.sectionTitle}>Error: No se proporcionó un ID de certificado.</Text>
        <CustomButton title="Volver al listado" onPress={() => navigation.goBack()} color="blue" />
      </ThemedView>
    );
  }

  const handleDelete = async (id: number) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) throw new Error('Token no disponible');
  
      const url = showMessages
        ? `${BACKEND_API}/api/messages/${id}`
        : `${BACKEND_API}/api/obituary/delete/${id}`;
  
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar');
      }
  
      if (showMessages) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      } else {
        setObituaries((prev) => prev.filter((obs) => obs.id !== id));
      }
  
      console.log(`Elemento eliminado correctamente. ID: ${id}`);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };
  

  const renderMessageRow = ({ item }: { item: Message }) => (
    <View style={styles.tableRow}>
      <View style={styles.contentCell}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.body}</Text>
        {item.images.map((imgUrl, index) => (
          <Image key={index} source={{ uri: imgUrl }} style={styles.image} />
        ))}
      </View>
      <View style={styles.actionCell}>
        <CustomButton title="Eliminar" color="red" onPress={() => {
          setElementIdToDelete(item.id);
          setModalVisible(true);
        }} />
      </View>
    </View>
  );

  const renderObituaryRow = ({ item }: { item: Obituary }) => (
    <View style={styles.tableRow}>
      <View style={styles.contentCell}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.text}>{item.farewellMessage}</Text>
        <Text style={styles.textItalic}>{item.farewellPhrase}</Text>
        {item.customImage ? (
          <Image source={{ uri: item.customImage }} style={styles.image} />
        ) : null}
      </View>
      <View style={styles.actionCell}>
        <CustomButton title="Eliminar" color="red" onPress={() => {
          setElementIdToDelete(item.id);
          setModalVisible(true);
        }} />
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <CustomButton
        title="Volver al listado"
        onPress={() => navigation.navigate('admin/certificatesManagement')}
        color="blue"
        style={styles.backButton}
      />

      <View style={styles.switchButtons}>
        <CustomButton
          title="Esquelas"
          onPress={() => setShowMessages(false)}
          color={!showMessages ? 'blue' : 'grey'}
          style={styles.toggleButton}
        />
        <CustomButton
          title="Mensajes"
          onPress={() => setShowMessages(true)}
          color={showMessages ? 'blue' : 'grey'}
          style={styles.toggleButton}
        />
      </View>

      <Text style={styles.sectionTitle}>
        {showMessages ? 'Listado de mensajes' : 'Listado de esquelas'}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={GlobalStyles.blue} style={{ marginTop: 30 }} />
      ) : (showMessages ? messages.length === 0 : obituaries.length === 0) ? (
        <Text style={styles.noDataText}>
          No hay {showMessages ? 'mensajes' : 'esquelas'} disponibles.
        </Text>
      ) : (
        <ScrollView style={{ maxHeight: '70%' }}>
          <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
            <View style={styles.tableWrapper}>
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Contenido</Text>
                <Text style={styles.headerCell}>Acciones</Text>
              </View>
              <FlatList
                data={showMessages ? messages : obituaries}
                keyExtractor={(item) => item.id.toString()}
                renderItem={showMessages ? renderMessageRow : renderObituaryRow}
              />
            </View>
          </ScrollView>
        </ScrollView>
      )}

      {modalVisible && (
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Confirmar eliminación"
        >
          <Text style={{ textAlign: 'center' }}>
            ¿Estás seguro de que deseas eliminar {showMessages ? 'este mensaje' : 'esta esquela'}?
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 10 }}>
            <CustomButton title="Cancelar" color="grey" onPress={() => setModalVisible(false)} />
            <CustomButton
              title="Eliminar"
              color="red"
              onPress={async () => {
                if (elementIdToDelete !== null) {
                  await handleDelete(elementIdToDelete);
                  setModalVisible(false);
                  setElementIdToDelete(null);
                }
              }}
            />
          </View>
        </CustomModal>
      )}

    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: GlobalStyles.white,
    flex: 1,
  },
  backButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  switchButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  toggleButton: {
    width: 130,
    height: 45,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GlobalStyles.darkGrey,
    marginBottom: 10,
    textAlign: 'center',
  },
  scrollContainer: {
    minWidth: screenWidth,
  },
  tableWrapper: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: GlobalStyles.blue,
    padding: 10,
    borderRadius: 8,
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
  },
  contentCell: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  textItalic: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 4,
    textAlign: 'center',
  },
  image: {
    width: 150,
    height: 100,
    marginVertical: 5,
    borderRadius: 8,
  },
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
    color: GlobalStyles.blue,
    marginTop: 30,
  },  
});

export default withAuth(ReviewObituairesAndMessagesView, [AUTHORITIES.ADMIN]);
