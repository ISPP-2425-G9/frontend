import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import { ThemedText } from '@/components/ThemedText';
import { GlobalStyles } from '@/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import PaymentModal from './PaymentModal';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { BACKEND_API } from '@/constants/Mysc';
import { useAuth as useAuthApp } from '@/app/_util/useAuth';
import useAuth from '@/hooks/useAuth';
import { SuccessCancelModal } from "@/components/SucessCancelModel";

interface PlanCardProps {
  role: string;
  fechaExpiracion?: string;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  role, 
  fechaExpiracion,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { getUserFromStorage, updateUser } = useAuthApp();

  const [isPremium, setIsPremiun] = useState<boolean>(role.includes('PREMIUM'));
  const [isCustomer, setIsCustomer] = useState<boolean>(role.includes('CUSTOMER'));
  const [expirationDate, setExpirationDate] = useState<string | null>(fechaExpiracion ?? null);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

  const disableModal = () => setIsModalVisible(false);
  const disableCancelModal = () => setIsCancelModalVisible(false);

  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  const updateIsDesktop = useCallback(() => {
    setIsDesktop(Dimensions.get('window').width > 800);
  }, []);

  useFocusEffect(
    useCallback(() => {

      updateIsDesktop();
      const dimensions = Dimensions.addEventListener('change', updateIsDesktop);

      return () => {
        dimensions.remove();
        disableModal();
        disableCancelModal();
      };
    }, [])
  );


  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [nextPayment, setNextPayment] = useState('');
  const [borderColor, setBorderColor] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');

  const { roles, expiredPlanDate } = useAuth();
  useEffect(() => {
    const isPremium = Boolean(roles?.some(r => r.includes('PREMIUM')));  
    const isCustomer = Boolean(roles?.some(r => r.includes('CUSTOMER')));
    setIsPremiun(isPremium || false);
    setIsCustomer(isCustomer || true);
    setExpirationDate(expiredPlanDate?.toLocaleDateString("es-ES") || null)
    const details = getPlanDetails(isCustomer, isPremium);
    if (details) {
      setTitle(details.title || '');
      setDescription(details.description || '');
      setPrice(details.price || '');
      setNextPayment(details.nextPayment || '');
      setBorderColor(details.borderColor || '');
      setBackgroundColor(details.backgroundColor || '');
    }
  }, [roles, expiredPlanDate]);


  const getPlanDetails = (isCustomer: boolean, isPremium: boolean) => {
    if (!isCustomer) {
      return {
        title: 'PLAN PREMIUM - PUBLICITA TU EMPRESA',
        description: `
        Este plan premium está diseñado para empresas del sector funerario que buscan publicitarse en nuestra plataforma. Beneficios:
        - Exposición en la plataforma en el apartado de empresas destacadas del sector.
        - Publicidad destacada en búsquedas.
        `,
        price: '9.99€/mes',
        nextPayment: isPremium ? expirationDate: "",
        borderColor: GlobalStyles.red,
        backgroundColor: isPremium ? GlobalStyles.lightGrey : GlobalStyles.white,
      };
    }
    if (isCustomer) {
      return {
        title: 'PLAN PREMIUM - PROGRAMA TUS MENSAJES DE DESPEDIDA',
        description: `
        Este plan mensual permite programar mensajes personalizados que serán enviados tras la confirmación de tu fallecimiento. Beneficios:
        - Personalización total de mensajes (vídeos, fotos, mensaje de texto).
        - Personalizacion gratuita de tu esquela digital.
        - Envío automatizado tras verificación.
        - Notificación a los destinatarios elegidos.
        - Tranquilidad y seguridad garantizadas.
        `,
        price: '0.99€/mes',
        nextPayment: isPremium ? expirationDate: "",
        borderColor: GlobalStyles.blue,
        backgroundColor: isPremium ? GlobalStyles.lightGrey : GlobalStyles.white,
      };
    }
  };

  

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
    disableModal();
    setShowPaymentModal(true);
  };


  const handleUnsubscribe = async () => {
    setIsProcessing(true);
    try {
      
      const userData = await getUserFromStorage();
      const authToken = userData?.token;

      if (!authToken) {
        throw new Error('No se encontró el token de autenticación');
      }

      const userId = userData.id;
      
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
      
      await updateUser({
        "token": responseData.token,
        "roles": responseData.roles,
        "expiredPlanDate": responseData.expiredPlanDate,
      });

      disableCancelModal();
      setIsProcessing(false);
      setShowCancelSuccess(true);
    } catch (err) {
      console.error('Error al cancelar la suscripción:', err);
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const userData = await getUserFromStorage();
      const authToken = userData.token;
      if (!authToken) {
        throw new Error('No se encontró un token de autenticación');
      }

      setShowPaymentModal(false);
    } catch (err) {
      console.error('Error al procesar la suscripción:', err);
    }
  };

  const handleCancelSuccessClose = () => {
    setShowCancelSuccess(false);
  };

  return (
    <View style={[isDesktop ? styles.cardContainerDesktop : styles.cardContainerMobile]}>
      {title && (
        <View style={[styles.card, { borderColor, backgroundColor }]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.price}>{price}</Text>
          {nextPayment && <Text style={styles.payment}>Próximo pago: {nextPayment}</Text>}
          <TouchableOpacity
            style={isPremium ? styles.buttonCancel : styles.buttonSubscribe}
            onPress={() => (isPremium ? setIsCancelModalVisible(true) : setIsModalVisible(true))}
          >
            <Text style={styles.buttonText}>{isPremium ? 'Darse de baja' : 'Contratar plan'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {isCustomer && (
        <View style={[styles.card, { borderColor: esquelasDetails.borderColor, backgroundColor: esquelasDetails.backgroundColor }]}> 
          <Text style={styles.title}>{esquelasDetails.title}</Text>
          <Text style={styles.description}>{esquelasDetails.description}</Text>
          <Text style={styles.price}>{esquelasDetails.price}</Text>
        </View>
      )}

      <CustomModal visible={isModalVisible} onClose={disableModal} title="Confirmar contratación" style={styles.modal}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalText}>¿Estás seguro que deseas contratar este plan?</ThemedText>
          <View style={styles.buttonContainer}>
            <CustomButton title="Cancelar" onPress={disableModal} style={styles.button} color="red" />
            <CustomButton title={isProcessing ? 'Procesando...' : 'Confirmar'} onPress={handleSubscribe} style={styles.button} color="blue" />
          </View>
        </View>
      </CustomModal>

      <CustomModal visible={isCancelModalVisible} onClose={disableCancelModal} title="Cancelar suscripción" style={styles.modal}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalText}>¿Estás seguro que deseas cancelar tu suscripción?</ThemedText>
          <View style={styles.buttonContainer}>
            <CustomButton title="Cancelar" onPress={disableCancelModal} style={styles.button} color="red" />
            <CustomButton title={isProcessing ? 'Procesando cancelación...' : 'Confirmar'} onPress={handleUnsubscribe} style={styles.button} color="blue" disabled={isProcessing} />
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
        onClose={() => setShowPaymentModal(false)}
        amount={isCustomer ? 0.99 : 9.99}
        planType={isCustomer ? 'basic' : 'premium'}
        description={`Suscripción al Plan ${isCustomer ? 'mensual' : 'mensual de empresa'}`}
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
    cardContainerMobile: {
      flexDirection: 'column',
      justifyContent: 'center',
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