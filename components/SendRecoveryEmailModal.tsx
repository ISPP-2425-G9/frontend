import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNotification } from '@/context/NotificationContext';

interface SendRecoveryEmailModalProps {
    visible: boolean;
    onClose: () => void;
    onSend: (email: string) => void;
}

const SendRecoveryEmailModal: React.FC<SendRecoveryEmailModalProps> = ({ visible, onClose, onSend }) => {
    const [email, setEmail] = useState('');
    const { showNotification } = useNotification();

    const handleSend = () => {
        if (!email.includes('@')) {
            showNotification({
                message: 'Correo inválido',
                type: 'error',
                duration: 2000,
            });
            return;
        }

        onSend(email);
        onClose();
        setEmail('');
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Enviar Código de Recuperación</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSend}>
                            <Text style={styles.buttonText}>Enviar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '33%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#FF4D4D',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default SendRecoveryEmailModal;
