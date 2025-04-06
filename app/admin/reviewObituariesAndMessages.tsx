import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import CustomButton from '@/components/CustomButton';
import { ThemedView } from '@/components/ThemedView';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';
import { GlobalStyles } from '@/constants/Colors';


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
  const { certificateId } = route.params;
  const navigation = useNavigation();

  const [showMessages, setShowMessages] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [obituaries, setObituaries] = useState<Obituary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      setTimeout(() => {
        const mockMessages: Message[] = [
          {
            id: 1,
            title: 'Última Voluntad 1',
            body: 'Este es el último mensaje de prueba.',
            images: [
              'https://static.nationalgeographicla.com/files/styles/image_3200/public/comedy-wildlife-awards-squirel-stop.jpg',
              'https://static.nationalgeographicla.com/files/styles/image_3200/public/comedy-wildlife-awards-squirel-stop.jpg'
            ]
          },
          {
            id: 2,
            title: 'Mensaje General',
            body: 'Otro mensaje de prueba.',
            images: []
          },
          {
            id: 3,
            title: 'Mensaje General',
            body: 'Otro mensaje de prueba.',
            images: [
              'https://static.nationalgeographicla.com/files/styles/image_3200/public/comedy-wildlife-awards-squirel-stop.jpg'
            ]
          },
          {
            id: 4,
            title: 'Recuerdo especial',
            body: 'Siempre estarás en nuestros corazones.',
            images: []
          }
        ];

        const mockObituaries: Obituary[] = [
          {
            id: 1,
            name: 'Nombre Ejemplo 1',
            farewellMessage: 'Mensaje de despedida 1',
            farewellPhrase: 'Frase de despedida 1',
            customImage: 'https://static.nationalgeographicla.com/files/styles/image_3200/public/comedy-wildlife-awards-squirel-stop.jpg'
          },
          {
            id: 2,
            name: 'Nombre Ejemplo 2',
            farewellMessage: 'Mensaje de despedida 2',
            farewellPhrase: 'Frase de despedida 2',
            customImage: 'https://static.nationalgeographicla.com/files/styles/image_3200/public/comedy-wildlife-awards-squirel-stop.jpg'
          },
          {
            id: 3,
            name: 'Don Andrés Gómez',
            farewellMessage: 'Gracias por tantos momentos compartidos.',
            farewellPhrase: 'Hasta siempre, maestro.',
            customImage: ''
          }
        ];

        setMessages(mockMessages);
        setObituaries(mockObituaries);
        setLoading(false);
      }, 1000);
    };

    loadData();
  }, [certificateId]);

  const handleDelete = (id: number) => {
    console.log(`Eliminar ${showMessages ? 'mensaje' : 'esquela'} con ID: ${id}`);
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
        <CustomButton title="Eliminar" color="red" onPress={() => handleDelete(item.id)} />
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
        <CustomButton title="Eliminar" color="red" onPress={() => handleDelete(item.id)} />
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
});

export default withAuth(ReviewObituairesAndMessagesView, [AUTHORITIES.ADMIN]);
