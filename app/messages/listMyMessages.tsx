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
    //'messages/listMyMessages': {messageId: number};
    'messages/listMyMessages': undefined;
    'messages/index': undefined;
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

    return (
        <ScrollView>
            <ThemedView style={styles.container}>
                <View style={styles.introContainer}>
                    <Text style={styles.introTitle}>Mensajes</Text>
                    <Text style={styles.introText}>
                        En esta sección, podrá crear un mensaje para enviar tal tal tal.
                    </Text>
                </View>
                <ScrollView>
                    {messages.map((message) => (
                        <View key={message.id} style={styles.messageContainer}>
                            <Text style={styles.messageText}>Título: {message.title}</Text>
                            <CustomButton
                                title="Eliminar"
                                color="red"
                                onPress={() => { handleDeleteSubmit(message.id); }}
                            />
                        </View>
                    ))}
                    <CustomButton
                        title="Crea un mensaje para un ser querido"
                        color='blue'
                        onPress={() => { navigation.navigate('messages/index'); }} />
                </ScrollView>
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        flexGrow: 1,
        justifyContent: 'space-between',
        padding: "1%",
        backgroundColor: GlobalStyles.white,
        alignItems: 'center',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageContainer: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        margin: 5,
    },
    messageText: {
        fontSize: 16,
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
        fontSize: 20,
        color: GlobalStyles.darkGrey,
        textAlign: 'center',
        lineHeight: 22,
      },
});

export default withAuth(MessageList, [AUTHORITIES.CUSTOMER_PREMIUM]);
