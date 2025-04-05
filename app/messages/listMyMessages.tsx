import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_API } from '@/constants/Mysc';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';
import useAuth from "@/hooks/useAuth";
import { GlobalStyles } from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import CustomModal from '@/components/CustomModal';

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

interface Message {
    id: number;
    title: string;
    body: string;
    code: string;
    //customImages: string[];
}

type RootStackParamList = {
    'messages/listMyMessages':
    undefined;
    is_newMessage: boolean;
    'messages/index': {
        messageId: number | undefined;
        is_newMessage: boolean;
    } | undefined;
};

function MessageList() {

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { isAuthenticated } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                const userData = await AsyncStorage.getItem('user_data');
                const userId = userData ? JSON.parse(userData).id : null;
                try {
                    const authToken = await AsyncStorage.getItem('authToken');
                    if (!authToken) throw new Error('No se encontró un token de autenticación');

                    const response = await fetch(`${BACKEND_API}/api/messages/${userId}/my_messages`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken.trim()}`,
                        },
                    });

                    if (response.ok) {
                        const data: Message[] = await response.json();
                        setMessages(data);
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

    const handleDeleteSubmit = async () => {

        const messageId = selectedMessageId

        try {
            const authToken = await AsyncStorage.getItem('authToken');
            const response = await fetch(BACKEND_API + `/api/messages/${messageId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                setMessages(messages.filter(m => m.id !== messageId));
                setModalVisible(false);
            } else {
                console.error('Error al eliminar el mensage');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    const showConfirmationModal = (messageId: number) => {
        setSelectedMessageId(messageId);
        setModalMessage('¿Estas seguro de que quieres eliminar este mensaje?');
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedMessageId(null);
    };

    if (loading) {
        return (
            <ThemedView style={styles.centeredContainer}>
                <ThemedText type="title">Cargando...</ThemedText>
            </ThemedView>
        );
    }



    return isAuthenticated && (
        <ScrollView contentContainerStyle={styles.container}>
            <ThemedView style={styles.introContainer}>
                <Text style={styles.introTitle}>Mensajes ✉️</Text>
                <Text style={styles.introText}>
                    En esta sección, podrás ver y crear mensajes para tus seres queridos.
                </Text>
                <Text style={styles.introText}>
                    (En estos momentos la imagen de preview por defecto es siempre la misma. En la próxima versión podrá visualizar sus imágenes correctamente)
                </Text>
            </ThemedView>

            <CustomButton
                title="Crea un mensaje para un ser querido"
                color="green"
                style={styles.floatingButton}
                onPress={() => navigation.navigate('messages/index', { messageId: undefined, is_newMessage: true })}
            />

            <View style={styles.messagesWrapper}>
                {messages.map((message) => (
                    <View
                        key={message.id}
                        style={styles.messageContainer}
                    >
                        <Text style={styles.messageText}>Título: {message.title}</Text>
                        <Image source={require('@/assets/images/caronte_gris.png')} style={styles.messagePreviewImage} />
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                title="Editar"
                                color="blue"
                                style={styles.button1}
                                onPress={() => navigation.navigate('messages/index', { messageId: message.id, is_newMessage: false })}
                            />
                            <CustomButton
                                title="Eliminar"
                                color="red"
                                style={styles.button1}
                                onPress={() => { showConfirmationModal(message.id) }}
                            />
                        </View>
                    </View>
                ))}
            </View>
            {modalVisible && (
                <CustomModal
                    visible={modalVisible}
                    onClose={handleCloseModal}
                    title={modalMessage}
                    style={styles.modalStyle}
                >
                    <View style={styles.buttonModalContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleDeleteSubmit}>
                            <Text style={styles.buttonText}>Aceptar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </CustomModal>)}
        </ScrollView >
    );
}

const styles = StyleSheet.create({

    introContainer: {
        width: '90%',
        backgroundColor: GlobalStyles.lightGrey,
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        marginTop: 20,
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
        lineHeight: 24,
    },
    messagePreviewImage: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        borderRadius: 10,
        resizeMode: "contain"
    },
    allMessagesContainer: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    container: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 10,
        backgroundColor: GlobalStyles.white,
        alignItems: 'center',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messagesWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: "center",

    },
    messageContainer: {
        width: width > 600 ? "18%" : "45%",
        padding: 15,
        borderRadius: 12,
        backgroundColor: GlobalStyles.lightGrey,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        alignItems: 'center',
        margin: 10,
        gap: 10,
    },
    messageText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: GlobalStyles.darkGrey,
        textAlign: 'center',
    },
    changeScreenButton: {
        marginTop: 10,
        width: 50,
        height: 50,
    },
    floatingButton: {
        padding: 10,
        width: width > 600 ? '30%' : '80%',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        gap: 10,

    },
    button1: {
        width: width > 600 ? "80%" : "40%",
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
        gap: '10%'

    },
    button: {
        backgroundColor: GlobalStyles.blue,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignItems: 'center',
    },
});

export default withAuth(MessageList, [AUTHORITIES.CUSTOMER_PREMIUM]);

