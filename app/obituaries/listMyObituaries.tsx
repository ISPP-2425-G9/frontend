import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, useWindowDimensions, ScrollView, TouchableOpacity, Text, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '@/components/CustomButton';
import { GlobalStyles } from '@/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import CustomModal from '@/components/CustomModal';
import { BACKEND_API } from '@/constants/Mysc';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  'obituaries/createObituary': { imageTemplateId: number; imageUrl: string, is_newObituary: boolean, obituaryId: number };
  'obituaries/index': undefined;
};


function ObituaryIndex() {
  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width, height } = useWindowDimensions(); 

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  interface Obituary {
    id: number;
    name: string;
    isMine: boolean;
    deathDate: string;
    imageTemplate: {
      imageId: number;
      imageUrl: string;
    };
  }

  const [obituaries, setObituaries] = useState<Obituary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedObituaryId, setSelectedObituaryId] = useState<number | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const authToken = await AsyncStorage.getItem('authToken');
          if (!authToken) throw new Error('No se encontró un token de autenticación');
    
          const response = await fetch(BACKEND_API+'/api/obituary/myObituaries', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken.trim()}`,
            },
          });
    
          if (response.ok) {
            const data: Obituary[] = await response.json();
            setObituaries(data);
          }
  
        } catch (error) {
          console.error('Error en la solicitud:', error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
    }, [])
  );
  
  
  
  const showConfirmationModal =  (obituaryId: number) => {
    setSelectedObituaryId(obituaryId);
    setModalMessage( '¿Estas seguro que quieres eliminar esta esquela?');
    setModalVisible(true);
  };

  
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedObituaryId(null);
  };


  const handleSubmit = async () => {
    if (!selectedObituaryId) return;

    try {
      const authToken = await AsyncStorage.getItem('authToken'); 
      const response = await fetch(BACKEND_API+`/api/obituary/delete/${selectedObituaryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        setObituaries(obituaries.filter(ob => ob.id !== selectedObituaryId));
      } else {
        console.error('Error al eliminar la esquela');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      handleCloseModal();
    }
  };
  

  const handleObituaryPress = (imageTemplateId: number, imageUrl: string, obituaryId: number) => {
    navigation.navigate(
      'obituaries/createObituary', { 
        imageTemplateId, 
        imageUrl,
        is_newObituary: false,
        obituaryId,
       });
  };

  if (loading) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText type="title">Cargando...</ThemedText>
      </ThemedView>
    );
  }



  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Sus esquelas</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {obituaries.map((item) => (
             <TouchableOpacity
             key={item.id} 
             onPress={() => handleObituaryPress(item.imageTemplate.imageId, item.imageTemplate.imageUrl, item.id)} 
             style={[
               styles.obituaryCard, 
               { 
                 width: width * 0.20, 
                 height: height * 0.65, 
                 borderColor: item.isMine ? GlobalStyles.blue : GlobalStyles.grey,  
                 borderWidth: 6,  
               }
             ]} 
           >
              <Image source={{ uri: item.imageTemplate.imageUrl }} style={styles.image} />
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>{item.isMine ? `${item.name} (Su propia esquela)` : item.name}</Text>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                { item.deathDate === null ? (
                  <CustomButton title="Eliminar" color="red" onPress={() => showConfirmationModal(item.id)} />
                ) : (
                  <CustomButton 
                  title="Esquela ya enviada" 
                  onPress={() => {}} 
                />
              )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.divider} />
      <View style={styles.buttonContainer}>
        <CustomButton title="Crea una esquela" onPress={() => navigation.navigate('obituaries/index')} />
      </View>   
      {modalVisible && (
        <CustomModal
          visible={modalVisible}
          onClose={handleCloseModal}
          title={modalMessage}
          style={styles.modalStyle}
        >
          <View style={styles.buttonModalContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleCloseModal()}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flex: 1,
    alignItems: 'center',
    paddingTop: 120,
    backgroundColor: '#ffff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  listContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  obituaryCard: {
    margin: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    overflow: 'hidden',
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
    gap: '4%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    borderRadius: 8,
    padding: '20%',
  },
  overlayText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonModalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1%',
    flexDirection: 'row',
    width: '20%',
    gap: '2%'

  },
   button: {
      backgroundColor: GlobalStyles.blue,
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 8,
      alignItems: 'center',
    },
    modalStyle: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 15,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
      width: width > 600 ? '40%' : '80%', 
    },
});

export default withAuth(ObituaryIndex, [AUTHORITIES.CUSTOMER, AUTHORITIES.ADMIN])