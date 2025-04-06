import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';
import CustomModal from '@/components/CustomModal';
import CustomButton from '@/components/CustomButton';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { STRIPE_PUBLISHABLE_KEY } from '@/constants/Stripe';
import { useAuth } from '@/app/_util/useAuth';
import SecureField from './SecureField';
import SuccessModalObituary from './SuccessModalObituary';
import useIsDesktop from '@/hooks/useResponsiveLayout';

interface PaymentModalObituaryProps {
  visible: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  onSuccess?: () => void;
}

const CheckoutForm: React.FC<PaymentModalObituaryProps> = ({
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
  const { getUserFromStorage } = useAuth();
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
        throw new Error(error.message); 
      }

      if (paymentMethod) {
        try {
          onSuccess?.();
          setShowSuccess(true);
          onClose();
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error('Error en el servidor:', err.message);
          } else {
            console.error('Error desconocido en el servidor');
          }
          setIsProcessing(false);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error al procesar el pago:', err.message);
      } else {
        console.error('Error desconocido al procesar el pago');
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
          <Text style={styles.amount}>{amount.toFixed(2)}€</Text>

          <View style={styles.cardContainer}>
            <SecureField 
              label="Número de tarjeta" 
              element={CardNumberElement}
              isCardNumber
              style={styles.fullWidthField}
            />
            
            <View style={[styles.middleRow, isMobile && styles.mobileMiddleRow]}>
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
      <SuccessModalObituary visible={showSuccess} onClose={handleSuccessClose} />
    </>
  );
};

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const PaymentModalObituary: React.FC<PaymentModalObituaryProps> = (props) => (
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

export default PaymentModalObituary;
