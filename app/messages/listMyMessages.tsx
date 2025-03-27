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

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

interface Message {
    id: number;
    title: string;
    body: boolean;
    code: string;
    //customImages: string[];
}

type RootStackParamList = {
    'messages/listMyMessages': undefined;
    'messages/index': { messageId: number } | undefined;
};

function MessageList() {

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { isAuthenticated } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const authToken = await AsyncStorage.getItem('authToken');
                    if (!authToken) throw new Error('No se encontró un token de autenticación');

                    //cambiar por el customer id
                    const response = await fetch(BACKEND_API + '/api/messages/6/my_messages', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken.trim()}`,
                        },
                    });

                    if (response.ok) {
                        const data: Message[] = await response.json();
                        console.log(data);
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

    const handleDeleteSubmit = async (messageId: number) => {

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
            } else {
                console.error('Error al eliminar el mensage');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
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
            </ThemedView>
    
            <CustomButton
                title="Crea un mensaje para un ser querido"
                color="green"
                style={styles.floatingButton}
                onPress={() => { navigation.navigate('messages/index'); }}
            />
    
            <View style={styles.messagesWrapper}>
                {messages.map((message) => (
                    <TouchableOpacity
                        key={message.id}
                        style={styles.messageContainer}
                        onPress={() => navigation.navigate('messages/index', { messageId: message.id })}
                    >
                        <Text style={styles.messageText}>Título: {message.title}</Text>
                        <Image source={require('@/assets/images/team/rafael.png')} style={styles.messagePreviewImage} />
                        <CustomButton
                            title="Eliminar"
                            color="red"
                            onPress={() => { handleDeleteSubmit(message.id); }}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
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
    },
    messageContainer: {
        width: "18%",
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
        width: '30%',
        marginBottom: 20,
    },
});

export default withAuth(MessageList, [AUTHORITIES.CUSTOMER_PREMIUM]);
