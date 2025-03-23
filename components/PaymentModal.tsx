import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';
import CustomModal from '@/components/CustomModal';
import CustomButton from '@/components/CustomButton';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_API } from '@/constants/Mysc';

const { width } = Dimensions.get('window');

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51R1uerGa0d4217RGhYHV7bLOxmAPTyZklTeE72bfrrvfFdAS2aQOhF73AjpfBduudppxm4i7pb66DCNDQU6Hiyou00yD5rsLWb';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  amount: number;
  planType: string;
  description: string;
  onSuccess?: (paymentMethodId: string) => void;
}

const CheckoutForm: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  amount,
  description,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (error) {
        console.error('Error:', error);
        return;
      }

      if (paymentMethod) {
        try {
          const authToken = await AsyncStorage.getItem('authToken');
          if (!authToken) {
            throw new Error('No se encontró un token de autenticación');
          }

          const userId = await AsyncStorage.getItem('userId');
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
            throw new Error('Error al actualizar el plan');
          }

          onSuccess?.(paymentMethod.id);
          onClose();
        } catch (err: any) {
          console.error('Error en el servidor:', err.message);
        }
      }
    } catch (err) {
      console.error('Error al procesar el pago:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <CustomModal visible={visible} onClose={onClose} title="Pago seguro">
      <View style={styles.container}>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.amount}>{amount.toFixed(2)}€/mes</Text>

        <View style={styles.cardContainer}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Cancelar"
            onPress={onClose}
            color="red"
            style={styles.button}
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
          <ActivityIndicator size="large" color={GlobalStyles.blue} style={styles.loader} />
        )}
      </View>
    </CustomModal>
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
    width: width > 600 ? '80%' : '100%',
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
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 10,
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
  loader: {
    marginTop: 20,
  },
});

export default PaymentModal;