import { useNotification } from '@/context/NotificationContext';
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import SendRecoveryEmailModal from './SendRecoveryEmailModal';
import { BACKEND_API } from '@/constants/Mysc';

interface RememberPasswordModalProps {
    visible: boolean;
    onClose: () => void;
}

const width = Dimensions.get("window").width;

const RememberPasswordModal: React.FC<RememberPasswordModalProps> = ({ visible, onClose }) => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [emailModalVisible, setEmailModalVisible] = useState(false);
    const { showNotification } = useNotification();

    const handleSendRecovery = async (email: string) => {
        try {
            const response = await fetch(BACKEND_API + "/api/auth/password/remember?email=" + email, {
                method: "POST"
            });
            if(response.ok) {
                showNotification({
                    message: `Código enviado a ${email}`,
                    type: 'success',
                    duration: 2000,
                });
            } else {
                const message = await response.json();
                if("error" in message) {
                    throw Error(message.error);
                } else {
                    throw Error(JSON.stringify(message));
                }
            }
        } catch (error: any) {
            showNotification({
                message: error.message,
                type: 'error',
                duration: 2000,
            });
        }
    };

    const handleSubmit = async () => {
        if(!newPassword || !confirmPassword) {
            showNotification({
                message: `Debes rellenar ambos campos de contraseña`,
                type: 'error',
                duration: 2000,
            });
        } else if(!code || code?.length !== 5) {
            showNotification({
                message: `El código es de 5 dígitos`,
                type: 'error',
                duration: 2000,
            });
        } else if (newPassword === confirmPassword) {
            try {
                const response = await fetch(BACKEND_API + "/api/auth/password/remember/verify", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, code, password: newPassword })
                });

                if (!response.ok) {
                    const json = await response.json();
                    const errorMessage = Object.values(json).map(error => "- " + error).join("\n");
                    throw new Error(errorMessage);
                }

                showNotification({
                    message: `Contraseña cambiada`,
                    type: 'success',
                    duration: 2000,
                });
                onClose();
            } catch (error: any) {
                showNotification({
                    message: error.message,
                    type: 'error',
                    duration: 2000,
                });
            }
        } else {
            showNotification({
                message: "Las contraseñas no coinciden",
                type: "error",
                duration: 2000,
            });
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <SendRecoveryEmailModal
                visible={emailModalVisible}
                onClose={() => setEmailModalVisible(false)}
                onSend={handleSendRecovery}
            />
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Recuperar Contraseña</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Código de 5 cifras"
                        keyboardType="numeric"
                        maxLength={5}
                        value={code}
                        onChangeText={setCode}
                    />
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Nueva contraseña"
                            secureTextEntry={!showPassword}
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Confirmar nueva contraseña"
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Feather name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Enviar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => setEmailModalVisible(true)}>
                        <Text style={{ color: '#007BFF', marginTop: 10 }}>¿Necesitas el código? Enviar a tu correo</Text>
                    </TouchableOpacity>
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
        width: width > 600 ? '33%': '90%',
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
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        width: '100%',
        height: 40,
    },
    passwordInput: {
        flex: 1,
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

export default RememberPasswordModal;
