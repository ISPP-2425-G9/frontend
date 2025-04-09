import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, Image } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';
import CustomModal from '@/components/CustomModal';
import CustomButton from '@/components/CustomButton';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { BACKEND_API } from '@/constants/Mysc';
import { STRIPE_PUBLISHABLE_KEY } from '@/constants/Stripe';
import { useAuth } from '@/app/_util/useAuth';
import SecureField from './SecureField';
import SuccessModal from './SuccessModal';
import useIsDesktop from '@/hooks/useResponsiveLayout';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  amount: number;
  planType: string;
  description: string;
  onSuccess?: () => void;
}

const CheckoutForm: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  amount,
  description,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { updateUser, getUserFromStorage } = useAuth();
  const { isMobile } = useIsDesktop();

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    try {
      setIsProcessing(true);
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        throw new Error('No se pudo encontrar el elemento de tarjeta');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message || 'Error al procesar el pago');
      }

      if (paymentMethod) {
        try {
          const userData = await getUserFromStorage();
          const authToken = userData?.token;
          const userId = userData?.id;

          if (!authToken) {
            throw new Error('No se encontró el token de autenticación');
          }

          if (!userId) {
            throw new Error('No se encontró el ID de usuario');
          }

          const response = await fetch(`${BACKEND_API}/api/plans/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              paymentMethodId: paymentMethod.id,
              planType: 'PREMIUM',
            }),
          });

          if (!response.ok) {
            const errorData = await response.text();
            console.error('Error en la respuesta:', errorData);
            throw new Error('Error al actualizar el plan');
          }

          const responseData = await response.json();

          await updateUser({
            "token": responseData.token,
            "roles": responseData.roles,
            "expiredPlanDate": responseData.expiredPlanDate,
          });

          onSuccess?.();
          setShowSuccess(true);
          onClose();
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'Error desconocido en el servidor';
          console.error('Error en el servidor:', errorMessage);
          setIsProcessing(false);
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al procesar el pago';
      console.error('Error al procesar el pago:', errorMessage);
      if (err && typeof err === 'object' && 'error' in err) {
        const errorObj = err as { error: string };
        console.error('Detalles del error:', errorObj.error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <>
      <CustomModal 
        visible={visible} 
        onClose={onClose} 
        title={(
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Pago seguro con</Text>
            <Image 
              source={{ uri: 'https://stripe.com/img/about/logos/logos/blue@2x.png' }}
              style={styles.stripeLogo}
              resizeMode="contain"
            />
          </View>
        )}
      >
        <View style={styles.container}>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.amount}>{amount.toFixed(2)}€/mes</Text>

          <View style={styles.cardContainer} testID="card-container">
            <SecureField 
              label="Número de tarjeta" 
              element={CardNumberElement}
              isCardNumber
              style={styles.fullWidthField}
            />
            
            <View style={[styles.middleRow, isMobile && styles.mobileMiddleRow]} testID="middle-row">
              <SecureField 
                label="Fecha exp." 
                element={CardExpiryElement}
                style={[styles.expiryField, isMobile && styles.mobileField]}
              />
              <SecureField 
                label="CVV" 
                element={CardCvcElement}
                style={[styles.cvcField, isMobile && styles.mobileField]}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Cancelar"
              onPress={onClose}
              color="red"
              style={styles.button}
              disabled={isProcessing}
            />
            <CustomButton
              title={isProcessing ? "Procesando..." : "Pagar"}
              onPress={handlePayment}
              color="blue"
              style={styles.button}
              disabled={isProcessing}
            />
          </View>

          {isProcessing && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={GlobalStyles.blue} style={styles.loader} />
              <Text style={styles.loaderText}>Procesando tu pago...</Text>
            </View>
          )}
        </View>
      </CustomModal>
      <SuccessModal visible={showSuccess} onClose={handleSuccessClose} />
    </>
  );
};

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const PaymentModal: React.FC<PaymentModalProps> = (props) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm {...props} />
  </Elements>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '80%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  description: {
    fontSize: 16,
    color: GlobalStyles.darkGrey,
    marginBottom: 10,
    textAlign: 'center',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GlobalStyles.blue,
    textAlign: 'center',
    marginBottom: 20,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  middleRow: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  mobileMiddleRow: {
    flexDirection: 'column',
  },
  fullWidthField: {
    width: '100%',
  },
  expiryField: {
    flex: 0.6,
  },
  cvcField: {
    flex: 0.4,
  },
  mobileField: {
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    maxWidth: 400,
    alignSelf: 'center',
    gap: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    maxWidth: 160,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424770',
  },
  stripeLogo: {
    width: 60,
    height: 20,
  },
});

export default PaymentModal;
