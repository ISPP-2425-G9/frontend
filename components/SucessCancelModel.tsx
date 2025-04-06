import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const SuccessCancelModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const [scaleAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

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

  return (
    <CustomModal visible={visible} onClose={onClose} title="¡Cancelación exitosa!">
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
          <Text style={styles.successTitle}>¡Plan cancelado!</Text>
          <Text style={styles.successText}>
            Tu suscripción ha sido cancelada exitosamente. Volverás a tener acceso a las características básicas.
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
            onPress={onClose}
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
    successButtonContainer: {
      width: '100%',
      maxWidth: 200,
    },
    successButton: {
      width: '100%',
    },
  });

export { SuccessCancelModal };