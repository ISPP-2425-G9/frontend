import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import { ThemedText } from '@/components/ThemedText';
import { GlobalStyles } from '@/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import PaymentModal from './PaymentModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_API } from '@/constants/Mysc';
import React, { useCallback, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface PlanCardProps {
  role: string;
  fechaExpiracion?: string;
  userId: string;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  role, 
  fechaExpiracion,
  userId 
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const plan = role.split('_')[1].toLowerCase();
  const isPremium = plan === 'premium';
  const isCustomer = role.includes('CUSTOMER');
  let expirationDate = fechaExpiracion ? fechaExpiracion : null;
  const [isDesktop, setIsDesktop] = useState(Dimensions.get('window').width > 768);
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

  const handleUnsubscribe = () => {

    setIsCancelModalVisible(false);
  };

  const handlePaymentSuccess = async (paymentId: string) => {
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

      const response = await fetch(`${BACKEND_API}/api/plans/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          paymentMethodId: paymentId,
          planType: 'PREMIUM',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error en la respuesta del servidor:', errorData);
        throw new Error('Error al actualizar el plan');
      }

      console.log('Plan actualizado exitosamente en PlanCard');
      setShowPaymentModal(false);
    } catch (err) {
      console.error('Error al procesar la suscripción:', err);
    }
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
              title={isProcessing ? 'Procesando...' : 'Confirmar'}
              onPress={handleUnsubscribe}
              style={styles.button}
              color="blue"
            />
          </View>
        </View>
      </CustomModal>

      <PaymentModal
        visible={showPaymentModal}
        onClose={() => { setShowPaymentModal(false); }}
        amount={isPremium ? 4.99 : 0.99}
        planType={isPremium ? 'premium' : 'basic'}
        description={`Suscripción al Plan ${isPremium ? 'mensual empresa' : 'mensual'}`}
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
  
  });


export default PlanCard;
