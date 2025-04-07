import React, { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import CustomModal from '@/components/CustomModal';
import CustomButton from '@/components/CustomButton';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  'obituaries/index': undefined;
};

const SuccessModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
    const [scaleAnim] = useState(new Animated.Value(0));
    const [rotateAnim] = useState(new Animated.Value(0));
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const handleContinue = () => {
        onClose();
        navigation.navigate('obituaries/index');
    };

    return (
        <CustomModal visible={visible} onClose={onClose} title="¡Pago exitoso!">
            <View style={styles.successContainer}>
                <Animated.View
                    style={[
                        styles.checkmarkContainer,
                        {
                            transform: [
                                { scale: scaleAnim },
                                { translateY: slideAnim }
                            ]
                        }
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.checkmarkCircle,
                            {
                                transform: [{ rotate: spin }],
                                shadowColor: '#43a047',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 5,
                            }
                        ]}
                    >
                        <FontAwesome name="check" size={40} color="#fff" />
                    </Animated.View>
                </Animated.View>
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    <Text style={styles.successTitle}>¡Pago de esquela realizado exitosamente!</Text>
                    <Text style={styles.successText}>
                        Tu esquela ha sido guardada exitosamente. Ahora tus seres queridos recibirán el aviso con todo el cuidado y respeto que merecen. Gracias por confíar en Caronte.
                    </Text>
                </Animated.View>
                <Animated.View
                    style={[
                        styles.successButtonContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <CustomButton
                        title="Continuar"
                        onPress={handleContinue}
                        color="blue"
                        style={styles.successButton}
                    />
                </Animated.View>
            </View>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    successContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
    },
    successButtonContainer: {
        width: '100%',
        maxWidth: 200,
    },
    successButton: {
        width: '100%',
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#43a047',
        marginBottom: 10,
        textAlign: 'center',
    },
    successText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    checkmarkContainer: {
        marginBottom: 20,
    },
    checkmarkCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#43a047',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default SuccessModal;