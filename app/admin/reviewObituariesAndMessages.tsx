import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, FlatList, Dimensions } from 'react-native';
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

const mockMessages = [
  {
    id: 1,
    title: 'Última Voluntad 1',
    body: 'Este es el último mensaje de prueba.',
    images: [
      'https://static.nationalgeographicla.com/files/styles/image_3200/public/comedy-wildlife-awards-squirel-stop.jpg',
      'https://static.nationalgeographicla.com/files/styles/image_3200/public/comedy-wildlife-awards-squirel-stop.jpg',
    ],
  },
  {
    id: 2,
    title: 'Mensaje General',
    body: 'Otro mensaje de prueba.',
    images: [],
  },
  {
    id: 3,
    title: 'Mensaje General',
    body: 'Otro mensaje de prueba.',
    images: [
      'https://static.nationalgeographicla.com/files/styles/image_3200/public/comedy-wildlife-awards-squirel-stop.jpg',
    ],
  },
];

const mockObituaries = [
  {
    id: 1,
    name: 'Nombre Ejemplo 1',
    customImage: 'https://static.nationalgeographicla.com/files/styles/image_3200/public/comedy-wildlife-awards-squirel-stop.jpg',
    farewellMessage: 'Mensaje de despedida 1',
    farewellPhrase: 'Frase de despedida 1',
  },
  {
    id: 2,
    name: 'Nombre Ejemplo 2',
    customImage: 'https://static.nationalgeographicla.com/files/styles/image_3200/public/comedy-wildlife-awards-squirel-stop.jpg',
    farewellMessage: 'Mensaje de despedida 2',
    farewellPhrase: 'Frase de despedida 2',
  },
];

function ReviewObituairesAndMessagesView() {
  const route = useRoute<RouteProp<RouteParams, 'ReviewObituairesAndMessagesView'>>();
  const { certificateId } = route.params;
  const navigation = useNavigation();
  const [showMessages, setShowMessages] = useState(false);

  const handleDelete = (id: number) => {
    console.log(`Eliminar ${showMessages ? 'mensaje' : 'esquela'} con ID: ${id}`);
  };

  const renderMessageRow = ({ item }: { item: typeof mockMessages[0] }) => (
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

  const renderObituaryRow = ({ item }: { item: typeof mockObituaries[0] }) => (
    <View style={styles.tableRow}>
      <View style={styles.contentCell}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.text}>{item.farewellMessage}</Text>
        <Text style={styles.textItalic}>{item.farewellPhrase}</Text>
        {item.customImage && <Image source={{ uri: item.customImage }} style={styles.image} />}
      </View>
      <View style={styles.actionCell}>
        <CustomButton title="Eliminar" color="red" onPress={() => handleDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <CustomButton title="Volver al listado" onPress={() => navigation.goBack()} color="blue" style={styles.backButton} />

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
        {showMessages ? 'Listado de Mensajes' : 'Listado de Esquelas'}
      </Text>

      <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
        <View style={styles.tableWrapper}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Contenido</Text>
            <Text style={styles.headerCell}>Acciones</Text>
          </View>
          <FlatList
            data={showMessages ? mockMessages : mockObituaries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={showMessages ? renderMessageRow : renderObituaryRow}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  container: {
    padding: 10,
    backgroundColor: GlobalStyles.white,
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
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  textItalic: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  image: {
    width: 150,
    height: 100,
    marginVertical: 5,
    borderRadius: 8,
  },
});

export default withAuth(ReviewObituairesAndMessagesView, [AUTHORITIES.ADMIN]);
