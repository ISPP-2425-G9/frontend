import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';
import CustomModal from '@/components/CustomModal';
import CustomButton from '@/components/CustomButton';
import { ThemedText } from '@/components/ThemedText';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


interface PlanCardProps {
  role: 'CUSTOMER_FREE' | 'CUSTOMER_PREMIUM' | 'COMPANY_FREE' | 'COMPANY_PREMIUM';
  fechaExpiracion?: string;
}

const PlanCard: React.FC<PlanCardProps> = ({ role, fechaExpiracion }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const plan = role.split('_')[1].toLowerCase();
  const isPremium = plan === 'premium';
  const isCustomer = role.includes('CUSTOMER');
  let expirationDate = fechaExpiracion ? fechaExpiracion : null;
  const isDesktop = Dimensions.get('window').width > 768;

  useFocusEffect(
    useCallback(() => {
      return () => {
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
    // TODO: Implementar lógica de suscripción aquí en el futuro
    console.log('Contratando plan...');
  };

  const handleUnsubscribe = () => {
    // TODO: Implementar lógica de suscripción aquí en el futuro
    console.log('Dándote de baja...');
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
              <Text style={styles.buttonText}>Darte de baja</Text>
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
      <CustomModal visible={isModalVisible} onClose={() => {setIsModalVisible(false)}} title="Confirmar contratación">
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalText}>
            ¿Estás seguro que deseas contratar este plan?
          </ThemedText>
          <View style={styles.modalButtons}>
            <CustomButton
              title="Cancelar"
              onPress={() => {setIsModalVisible(false)}}
              style={styles.modalButton}
              color="red"
            />
            <CustomButton
              title={isProcessing ? 'Procesando...' : 'Confirmar'}
              onPress={handleSubscribe}
              style={styles.modalButton}
              color="blue"
            />
          </View>
        </View>
      </CustomModal>
      <CustomModal visible={isCancelModalVisible} onClose={() => {setIsCancelModalVisible(false)}} title="Cancelar suscripción">
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalText}>
            ¿Estás seguro que deseas cancelar tu suscripción?
          </ThemedText>
          <View style={styles.modalButtons}>
            <CustomButton
              title="Cancelar"
              onPress={() => {setIsCancelModalVisible(false)}}
              style={styles.modalButton}
              color="red"
            />
            <CustomButton
              title={isProcessing ? 'Procesando...' : 'Confirmar'}
              onPress={handleUnsubscribe}
              style={styles.modalButton}
              color="blue"
            />
          </View>
        </View>
      </CustomModal>
    </View>
  );
};


const styles = StyleSheet.create({
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
    modalContent: {
      padding: 20,
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 10,
      width: '90%',
      alignSelf: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
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
      width: '100%',
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
