import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, Animated, StyleProp } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';
import CustomModal from '@/components/CustomModal';
import CustomButton from '@/components/CustomButton';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_API } from '@/constants/Mysc';
import { FontAwesome } from '@expo/vector-icons';
import { STRIPE_PUBLISHABLE_KEY } from '@/constants/Stripe';
import { useAuth } from '@/app/_util/useAuth';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const cardElementStyle = {
  style: {
    base: {
      fontSize: isMobile ? '14px' : '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      iconColor: '#666EE8',
    },
    invalid: {
      color: '#9e2146',
    },
    complete: {
      color: 'inherit',
    },
  },
};

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  amount: number;
  planType: string;
  description: string;
  onSuccess?: (paymentMethodId: string, responseData: any) => void;
}

interface SecureFieldProps {
  label: string;
  element: typeof CardNumberElement | typeof CardExpiryElement | typeof CardCvcElement;
  style?: StyleProp<CustomViewStyle>;
  isCardNumber?: boolean;
}

interface CardChangeEvent {
  brand?: string;
  complete?: boolean;
  value?: string;
}

interface CustomViewStyle {
  flex?: number;
  width?: number | `${number}%` | 'auto';
  marginBottom?: number;
  [key: string]: unknown;
};

const SecureField: React.FC<SecureFieldProps> = ({ 
  label, 
  element: Element, 
  style,
  isCardNumber = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [cardBrand, setCardBrand] = useState<string>('');
  const [isComplete, setIsComplete] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (isFocused) {
      Animated.spring(scaleAnim, {
        toValue: 1.02,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [isFocused]);

  const handleCardChange = (event: CardChangeEvent) => {
    if (isCardNumber && event.brand) {
      setCardBrand(event.brand);
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
    setIsComplete(event.complete ?? false);
  };

  const getCardIcon = () => {
    switch (cardBrand.toLowerCase()) {
      case 'visa':
        return 'cc-visa';
      case 'mastercard':
        return 'cc-mastercard';
      case 'amex':
        return 'cc-amex';
      case 'discover':
        return 'cc-discover';
      case 'diners':
        return 'cc-diners-club';
      case 'jcb':
        return 'cc-jcb';
      default:
        return 'credit-card';
    }
  };

  return (
    <Animated.View style={[styles.secureFieldContainer, style, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.labelRow}>
        <View style={styles.labelContainer}>
          <Text style={styles.cardLabel}>{label}</Text>
          {isCardNumber && cardBrand && (
            <Animated.View style={[styles.cardBrandContainer, { opacity: fadeAnim }]}>
              <FontAwesome 
                name={getCardIcon()} 
                size={20} 
                color="#666EE8" 
                style={styles.cardBrandIcon}
              />
            </Animated.View>
          )}
        </View>
      </View>
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        isComplete && styles.inputContainerComplete
      ]}>
        <Element
          options={{
            ...cardElementStyle,
            style: {
              ...cardElementStyle.style,
              base: {
                ...cardElementStyle.style.base,
                color: '#424770',
              },
              complete: {
                color: '#43a047',
              }
            }
          }}
          onChange={handleCardChange}
          onFocus={() => { setIsFocused(true); }}
          onBlur={() => { setIsFocused(false); }}
        />
      </View>
    </Animated.View>
  );
};

const SuccessModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
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
    <CustomModal visible={visible} onClose={onClose} title="¡Pago exitoso!">
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
          <Text style={styles.successTitle}>¡Plan mensual activado!</Text>
          <Text style={styles.successText}>
            Tu cuenta ha sido actualizada exitosamente. Ahora puedes disfrutar de todas las características premium.
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
  const { login } = useAuth();

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    try {
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        throw new Error('No se pudo encontrar el elemento de tarjeta');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error('Error:', error);
        setIsProcessing(false);
        return;
      }

      if (paymentMethod) {
        try {
          const userDataStr = await AsyncStorage.getItem('user_data');
          
          if (!userDataStr) {
            throw new Error('No se encontraron datos de usuario');
          }
          const userData = JSON.parse(userDataStr);
          const authToken = userData.token;
          const userId = await AsyncStorage.getItem('userId'); 

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
          console.log('Plan actualizado exitosamente:', responseData);
          
          // Actualizar los roles usando login
          void login(
            responseData.id,
            responseData.token,
            responseData.roles,
            responseData.username,
            responseData.name
          );
          
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          onSuccess?.(paymentMethod.id, responseData);
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
      <CustomModal visible={visible} onClose={onClose} title="Pago seguro">
        <View style={styles.container}>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.amount}>{amount.toFixed(2)}€/mes</Text>

          <View style={styles.cardContainer}>
            <SecureField 
              label="Número de tarjeta" 
              element={CardNumberElement}
              isCardNumber
              style={styles.fullWidthField}
            />
            
            <View style={styles.middleRow}>
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
  secureFieldContainer: {
    marginBottom: 15,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardLabel: {
    fontSize: 12,
    color: '#424770',
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  inputContainerFocused: {
    borderColor: '#80bdff',
    shadowColor: 'rgba(0,123,255,0.25)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerComplete: {
    borderColor: '#43a047',
    backgroundColor: '#f8f9fa',
  },
  middleRow: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: 15,
    width: '100%',
  },
  fullWidthField: {
    width: '100%',
  },
  expiryField: {
    flex: isMobile ? 1 : 0.6,
  },
  cvcField: {
    flex: isMobile ? 1 : 0.4,
  },
  mobileField: {
    width: '100%',
    flex: undefined,
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
  cardBrandContainer: {
    marginLeft: 8,
  },
  cardBrandIcon: {
    marginTop: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
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
  loaderText: {
    marginTop: 10,
    color: GlobalStyles.blue,
    fontSize: 14,
  },
});

export default PaymentModal;