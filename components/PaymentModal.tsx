import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';
import CustomModal from '@/components/CustomModal';
import CustomButton from '@/components/CustomButton';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_API } from '@/constants/Mysc';

const { width } = Dimensions.get('window');

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  amount: number;
  planType: string;
  description: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  amount,
  planType,
  description,
  onSuccess,
  onError,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const validateCard = () => {
    if (cardNumber.length !== 16) return 'Número de tarjeta inválido';
    if (expiryDate.length !== 5) return 'Fecha de expiración inválida';
    if (cvv.length !== 3) return 'CVV inválido';
    if (cardHolder.length < 3) return 'Nombre del titular inválido';
    return null;
  };

  const handlePayment = async () => {
    const validationError = validateCard();
    if (validationError) {
      onError?.(validationError);
      return;
    }

    setIsProcessing(true);
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) throw new Error('No se encontró un token de autenticación');

      const response = await fetch(`${BACKEND_API}/api/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          amount,
          planType,
          paymentDetails: {
            cardNumber,
            expiryDate,
            cvv,
            cardHolder,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Error al procesar el pago');
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setCardNumber(cleaned.slice(0, 16));
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      setExpiryDate(cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4));
    } else {
      setExpiryDate(cleaned);
    }
  };

  return (
    <CustomModal visible={visible} onClose={onClose} title="Pago seguro">
      <View style={styles.container}>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.amount}>{amount.toFixed(2)}€/mes</Text>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Número de tarjeta</ThemedText>
          <TextInput
            style={styles.input}
            value={cardNumber}
            onChangeText={formatCardNumber}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            maxLength={16}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <ThemedText style={styles.label}>Fecha exp.</ThemedText>
            <TextInput
              style={styles.input}
              value={expiryDate}
              onChangeText={formatExpiryDate}
              placeholder="MM/YY"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1 }]}>
            <ThemedText style={styles.label}>CVV</ThemedText>
            <TextInput
              style={styles.input}
              value={cvv}
              onChangeText={(text) => setCvv(text.replace(/\D/g, '').slice(0, 3))}
              placeholder="123"
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Titular de la tarjeta</ThemedText>
          <TextInput
            style={styles.input}
            value={cardHolder}
            onChangeText={setCardHolder}
            placeholder="NOMBRE APELLIDOS"
            autoCapitalize="characters"
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
  inputContainer: {
    marginBottom: 15,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: GlobalStyles.darkGrey,
  },
  input: {
    borderWidth: 1,
    borderColor: GlobalStyles.lightGrey,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: GlobalStyles.white,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
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