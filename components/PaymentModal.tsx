import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';
import CustomModal from '@/components/CustomModal';
import CustomButton from '@/components/CustomButton';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_API } from '@/constants/Mysc';

const { width } = Dimensions.get('window');

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  amount: number;
  planType: string;
  description: string;
  onSuccess?: (paymentMethodId: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  amount,
  planType,
  description,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { createPaymentMethod } = useStripe();

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Crear el PaymentMethod con Stripe
      const { paymentMethod, error } = await createPaymentMethod({
        type: 'Card',
      });

      if (error) {
        console.error('Error al crear el método de pago:', error);
        return;
      }

      if (paymentMethod) {
        onSuccess?.(paymentMethod.id);
        onClose();
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
          <CardField
            postalCodeEnabled={false}
            placeholder={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={{
              backgroundColor: '#FFFFFF',
              textColor: '#000000',
            }}
            style={styles.cardField}
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