import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import { ThemedText } from '@/components/ThemedText';
import { GlobalStyles } from '@/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import PaymentModal from './PaymentModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Animated, ActivityIndicator } from 'react-native';
import { BACKEND_API } from '@/constants/Mysc';
import { useAuth } from '@/app/_util/useAuth';
import { FontAwesome } from '@expo/vector-icons';

interface PlanCardProps {
  role: string;
  fechaExpiracion?: string;
  userId: string;
}

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

const PlanCard: React.FC<PlanCardProps> = ({ 
  role, 
  fechaExpiracion,
  userId 
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { login } = useAuth();
  const plan = role.split('_')[1].toLowerCase();
  const isPremium = plan === 'premium';
  const isCustomer = role.includes('CUSTOMER');
  let expirationDate = fechaExpiracion ? fechaExpiracion : null;
  const [isDesktop, setIsDesktop] = useState(Dimensions.get('window').width > 768);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const updateIsDesktop = () => {
        setIsDesktop(Dimensions.get('window').width > 768);
      };
      const subscription = Dimensions.addEventListener('change', updateIsDesktop);
      updateIsDesktop();

      return () => {
        subscription.remove();

        setIsModalVisible(false);
        setIsCancelModalVisible(false);
      };
    }, [])
  );

  const getPlanDetails = () => {
    if (isPremium && !isCustomer) {
      return {
        title: 'PLAN PREMIUM - PUBLICITA TU EMPRESA',
        description: `
        Este plan premium está diseñado para empresas del sector funerario que buscan publicitarse en nuestra plataforma. Beneficios:
        - Exposición en la plataforma en el apartado de empresas destacadas del sector.
        - Publicidad destacada en búsquedas.
        `,
        price: '9.99€/mes',
        nextPayment: expirationDate,
        borderColor: GlobalStyles.red,
        backgroundColor: GlobalStyles.lightGrey,
      };
    }
    if (!isPremium && !isCustomer) {
      return {
        title: 'PLAN PREMIUM - PUBLICITA TU EMPRESA',
        description: `
        Este plan premium está diseñado para empresas del sector funerario que buscan publicitarse en nuestra plataforma. Beneficios:
        - Exposición en la plataforma en el apartado de empresas destacadas del sector.
        - Publicidad destacada en búsquedas.
        `,
        price: '9.99€/mes',
        nextPayment: expirationDate,
        borderColor: GlobalStyles.red,
        backgroundColor: GlobalStyles.white,
      };
    }
    if (isPremium && isCustomer) {
      return {
        title: 'PLAN MENSUAL - PROGRAMA TUS MENSAJES DE DESPEDIDA',
        description: `
        Este plan mensual permite programar mensajes personalizados que serán enviados tras la confirmación de tu fallecimiento. Beneficios:
        - Personalización total de mensajes (vídeos, fotos, mensaje de texto).
        - Personalizacion gratuita de tu esquela digital.
        - Envío automatizado tras verificación.
        - Notificación a los destinatarios elegidos.
        - Tranquilidad y seguridad garantizadas.
        `,
        price: '0.99€/mes',
        nextPayment: expirationDate,
        borderColor: GlobalStyles.blue,
        backgroundColor: GlobalStyles.lightGrey,
      };
    }
    if (!isPremium && isCustomer) {
      return {
        title: 'PLAN MENSUAL - PROGRAMA TUS MENSAJES DE DESPEDIDA',
        description: `
        Este plan mensual permite programar mensajes personalizados que serán enviados tras la confirmación de tu fallecimiento. Beneficios:
        - Personalización total de mensajes (vídeos, fotos, mensaje de texto).
        - Personalizacion gratuita de tu esquela digital.
        - Envío automatizado tras verificación.
        - Notificación a los destinatarios elegidos.
        - Tranquilidad y seguridad garantizadas.
        `,
        price: '0.99€/mes',
        nextPayment: expirationDate,
        borderColor: GlobalStyles.blue,
        backgroundColor: GlobalStyles.white,
      };
    }
  };

  const { title, description, price, nextPayment, borderColor, backgroundColor } = getPlanDetails() || {};

  const esquelasDetails = {
    title: 'ESQUELAS DIGITALES',
    description: `
    Crea y envía esquelas digitales personalizadas cuando lo necesites. Beneficios:
    - Personalización de textos y estilos.
    - Envío instantáneo a contactos tras la verificación.
    - Almacenamiento y acceso permanente.
    - Diseño elegante y fácil de compartir.
    - Tranquilidad y seguridad garantizadas.
    `,
    price: '1.99€/esquela',
    borderColor: GlobalStyles.grey,
    backgroundColor: GlobalStyles.lightGrey,
  };

  const handleSubscribe = () => {

    setIsModalVisible(false);
    setShowPaymentModal(true);
  };

  const handleUnsubscribe = async () => {
    setIsProcessing(true);
    try {
      const userDataStr = await AsyncStorage.getItem('user_data');
      
      if (!userDataStr) {
        throw new Error('No se encontraron datos de usuario');
      }
      const userData = JSON.parse(userDataStr);
      const authToken = userData.token;

      if (!authToken) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`${BACKEND_API}/api/plans/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          paymentMethodId: null,
          planType: 'FREE',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error en la respuesta:', errorData);
        throw new Error('Error al cancelar el plan');
      }

      const responseData = await response.json();
      console.log('Plan cancelado exitosamente:', responseData);
      
      void login(
        responseData.id,
        responseData.token,
        responseData.roles,
        responseData.username,
        responseData.name
      );

      setIsCancelModalVisible(false);
      setIsProcessing(false);
      setShowCancelSuccess(true);
    } catch (err) {
      console.error('Error al cancelar la suscripción:', err);
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('user_data');
      if (!userDataStr) {
        throw new Error('No se encontraron datos de usuario');
      }
      
      const userData = JSON.parse(userDataStr);
      const authToken = userData.token;
      if (!authToken) {
        throw new Error('No se encontró un token de autenticación');
      }

      console.log('Plan actualizado exitosamente en PlanCard');
      console.log('Rol del usuario', userData.roles);
      setShowPaymentModal(false);
    } catch (err) {
      console.error('Error al procesar la suscripción:', err);
    }
  };

  const handleCancelSuccessClose = () => {
    setShowCancelSuccess(false);
    window.location.reload();
  };

  return (
    <View style={[styles.cardContainer, isDesktop ? styles.cardContainerDesktop : styles.cardContainerMobile]}>
      {/* plan específico según el rol */}
      {title && (
        <View style={[styles.card, { borderColor, backgroundColor }]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.price}>{price}</Text>
          {nextPayment && <Text style={styles.payment}>Próximo pago: {nextPayment}</Text>}
          {isPremium ? (
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => {setIsCancelModalVisible(true)}}>
              <Text style={styles.buttonText}>Darse de baja</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.buttonSubscribe}
              onPress={() => {setIsModalVisible(true)}}
            >
              <Text style={styles.buttonText}>Contratar plan</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* esquelas digitales (siempre visible en usuarios customers) */}
      {isCustomer && (
        <View style={[styles.card, { borderColor: esquelasDetails.borderColor, backgroundColor: esquelasDetails.backgroundColor }]}>
          <Text style={styles.title}>{esquelasDetails.title}</Text>
          <Text style={styles.description}>{esquelasDetails.description}</Text>
          <Text style={styles.price}>{esquelasDetails.price}</Text>
        </View>
      )}
      <CustomModal visible={isModalVisible} onClose={() => {setIsModalVisible(false)}} title="Confirmar contratación" style={styles.modal}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalText}>
            ¿Estás seguro que deseas contratar este plan?
          </ThemedText>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Cancelar"
              onPress={() => { setIsModalVisible(false); }}
              style={styles.button}
              color="red"
            />
            <CustomButton
              title={isProcessing ? 'Procesando...' : 'Confirmar'}
              onPress={handleSubscribe}
              style={styles.button}
              color="blue"
            />
          </View>
        </View>
      </CustomModal>
      <CustomModal visible={isCancelModalVisible} onClose={() => {setIsCancelModalVisible(false)}} title="Cancelar suscripción" style={styles.modal}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalText}>
            ¿Estás seguro que deseas cancelar tu suscripción?
          </ThemedText>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Cancelar"
              onPress={() => { setIsCancelModalVisible(false); }}
              style={styles.button}
              color="red"
            />
            <CustomButton
              title={isProcessing ? 'Procesando cancelación...' : 'Confirmar'}
              onPress={handleUnsubscribe}
              style={styles.button}
              color="blue"
              disabled={isProcessing}
            />
          </View>
          {isProcessing && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={GlobalStyles.blue} style={styles.loader} />
              <Text style={styles.loaderText}>Procesando tu cancelación...</Text>
            </View>
          )}
        </View>
      </CustomModal>

      <SuccessCancelModal visible={showCancelSuccess} onClose={handleCancelSuccessClose} />

      <PaymentModal
        visible={showPaymentModal}
        onClose={() => { setShowPaymentModal(false); }}
        amount={!isCustomer ? 9.99 : 0.99}
        planType={!isCustomer ? 'premium' : 'basic'}
        description={`Suscripción al Plan ${!isCustomer ? 'mensual de empresa' : 'mensual'}`}
        onSuccess={handlePaymentSuccess}
      />
    </View>
  );
};


const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 10,
      marginTop: 15,
      gap: 10,
      maxWidth: 400,
      alignSelf: 'center',
    },
    button: {
      flex: 1,
      marginHorizontal: 5,
      maxWidth: 160,
    },
    cardContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContainerMobile: {
      flexDirection: 'column',
    },
    cardContainerDesktop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      flexWrap: 'wrap',
      gap: 50,
    },
    card: {
      borderWidth: 2,
      padding: 20,
      borderRadius: 8,
      marginVertical: 10,
      alignItems: 'center',
      width: '100%',
      maxWidth: 520,
      marginHorizontal: 15,
    },
    title: {
      fontSize: 18,
      fontFamily: GlobalStyles.fontBold,
      color: GlobalStyles.darkGrey,
      marginBottom: 8,
      textAlign: 'center',
    },
    description: {
      fontSize: 14,
      fontFamily: GlobalStyles.font,
      color: GlobalStyles.grey,
      textAlign: 'center',
      marginBottom: 8,
    },
    payment: {
      fontSize: 16,
      fontFamily: GlobalStyles.fontBold,
      color: GlobalStyles.darkGrey,
    },
    price: {
      fontSize: 20,
      fontFamily: GlobalStyles.fontBold,
      color: GlobalStyles.blue,
      fontWeight: 'bold',
    },
    buttonSubscribe: {
      marginTop: 10,
      backgroundColor: GlobalStyles.blue,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 5,
    },
    buttonCancel: {
      marginTop: 10,
      backgroundColor: GlobalStyles.red,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 5,
    },
    buttonText: {
      color: GlobalStyles.white,
      fontFamily: GlobalStyles.fontBold,
    },
    modal: {
      width: 'auto',
    },
    modalContent: {
      padding: 20,
      alignItems: 'center',
      alignSelf: 'center',
      elevation: 5,
    },
    modalText: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      color: '#333',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    modalButton: {
      flex: 1,
      marginHorizontal: 5,
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
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
    loaderContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
    loader: {
      marginTop: 20,
    },
    loaderText: {
      marginTop: 10,
      color: GlobalStyles.blue,
      fontSize: 14,
    },
  });


export default PlanCard;