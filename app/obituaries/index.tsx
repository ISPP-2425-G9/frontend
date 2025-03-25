import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation, NavigationProp, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import CustomButton from '@/components/CustomButton';
import { BACKEND_API } from '@/constants/Mysc';
import useAuth from "@/hooks/useAuth";
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { AUTHORITIES } from '../_util/Authorities';
import CustomModal from "@/components/CustomModal";
import { GlobalStyles } from "@/constants/Colors";
import { withAuth } from '../_util/withAuth';

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

type RootStackParamList = {
  'obituaries/createObituary': { imageTemplateId: number,
     imageUrl: string, 
     is_newObituary: boolean, 
     obituaryId: number,
     jsonData: string, 
     is_mine: boolean
    };
  'obituaries/listMyObituaries': undefined;
  'obituaries/index': { 
    is_newObituary: boolean,
     obituaryId: number, 
     jsonData: string, 
     changeDesign: boolean,
     is_mine: boolean
    };

};



function ObituaryIndex() {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, 'obituaries/index'>>();
  const [selectedObituary, setSelectedObituary] = useState<{ id: number; imageUrl: string } | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const is_newObituary = route.params?.is_newObituary ?? true;

  interface Obituary {
    id: number
    imageId: number;
    imageUrl: string;
  }

  const [obituaries, setObituaries] = useState<Obituary[]>([]);
  const [loading, setLoading] = useState(true);

  const changeDesign = route.params?.changeDesign ?? false;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(BACKEND_API+'/api/templates/urls');
        if (!response.ok) throw new Error('Error al obtener los datos');
        const data: Obituary[] = await response.json();
        setObituaries(data);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useFocusEffect(
      React.useCallback(() => {
        document.title = 'Esquelas';
      }, [])
    );

  const showConfirmationModal = (id: number, imageUrl: string) => {

    setSelectedObituary({ id, imageUrl });
    setModalMessage("¿Para quién es la esquela?");
    setModalVisible(true);  

  };


  const handleOwnObituary = async () => {
    if (!selectedObituary) return;

    const obituaryId = route.params?.obituaryId ?? undefined;
    const jsonData = route.params?.jsonData ?? undefined;    
    navigation.navigate('obituaries/createObituary', { 
      imageTemplateId: selectedObituary.id, 
      imageUrl: selectedObituary.imageUrl,
      is_newObituary,
      obituaryId,
      jsonData, 
      is_mine: true

    });

    setModalVisible(false);
  }

  const handleElseObituary = async () => {
    if (!selectedObituary) return;

    const obituaryId = route.params?.obituaryId ?? undefined;
    const jsonData = route.params?.jsonData ?? undefined;    
    navigation.navigate('obituaries/createObituary', { 
      imageTemplateId: selectedObituary.id, 
      imageUrl: selectedObituary.imageUrl,
      is_newObituary,
      obituaryId,
      jsonData, 
      is_mine: false
    });    

    setModalVisible(false);
  }


  const handleCloseModal = () => {
    setModalVisible(false);
  };


 
  
  

  if (loading) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText type="title">Cargando...</ThemedText>
      </ThemedView>
    );
  }

  return isAuthenticated ? (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Elige un diseño</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
        {obituaries.map((item) => (
          <TouchableOpacity
            key={item.id}  
            onPress={() => {
              if (changeDesign) {
                navigation.navigate('obituaries/createObituary', {
                  imageTemplateId: item.id,
                  imageUrl: item.imageUrl,
                  is_newObituary,
                  obituaryId: route.params?.obituaryId ?? undefined,
                  jsonData: route.params?.jsonData ?? undefined,
                  is_mine: route.params?.is_mine ,
                });
              } else {
                showConfirmationModal(item.id, item.imageUrl);
              }
            }}            style={[styles.obituaryCard]} 
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          </TouchableOpacity>
        ))}
        </View>
      </ScrollView>

      {modalVisible && !changeDesign && (
        <CustomModal
          visible={modalVisible}
          onClose={handleCloseModal}
          title={modalMessage}
          style={styles.modalStyle}
        >
          <View style={styles.buttonModalContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleOwnObituary()}
            >
              <Text style={styles.buttonText}>Tu propia esquela</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleElseObituary()}
            >
              <Text style={styles.buttonText}>Para un ser querido</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
      )}

      <View style={styles.divider} />
        <View style={styles.buttonContainer}>
          <CustomButton title="Tus esquelas" onPress={() => {navigation.navigate('obituaries/listMyObituaries')}} />
        </View>   
      </ThemedView>
  ) : (
    <ThemedView style={styles.container}>
    <Text style={styles.title}>Debes iniciar sesión para poder acceder a esta sección</Text>  
    </ThemedView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: GlobalStyles.font,
    padding: 8,
    alignItems: 'center',
    paddingTop: 30,
    backgroundColor: GlobalStyles.white,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  listContainer: {
    width: width > 600 ? '100%' : '60%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  obituaryCard: {
    padding: 10,
    margin: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    width: width > 600 ?  width* 0.20 : width * 0.95, 
    height: height * 0.65 
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
    marginVertical: 20,
  },

  buttonContainer: {
    width: '90%',
    alignItems: 'flex-end', 
    marginBottom: '0.5%', 
    marginRight: '6%',
  }, 
  buttonModalContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "1%",
      flexDirection: "row",
      width: "35%",
      gap: "2%",
  },
   buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    button: {
      backgroundColor: GlobalStyles.blue,
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 8,
      alignItems: "center",
      width: width > 600 ? "100%" : width * 0.4,
    },
    modalStyle: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 15,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
      width: width > 600 ? "40%" : "95%",
    },
});

export default withAuth(ObituaryIndex, [AUTHORITIES.CUSTOMER])