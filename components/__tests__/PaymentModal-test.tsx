import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentModal from '../PaymentModal';

jest.mock('@stripe/stripe-react-native', () => {
    return {
      useStripe: jest.fn().mockReturnValue({
        createPaymentMethod: jest.fn().mockResolvedValue({
          paymentMethod: { id: 'mockPaymentMethodId' },
          error: null,
        }),
        confirmPayment: jest.fn(),
      }),
      useElements: jest.fn().mockReturnValue({
        getElement: jest.fn(),
      }),
      StripeProvider: jest.fn(),
      CardNumberElement: jest.fn(),
      CardExpiryElement: jest.fn(),
      CardCvcElement: jest.fn(),
    };
  });
  
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key) => {
    if (key === 'user_data') {
      return Promise.resolve(JSON.stringify({ token: 'fake_token' }));
    }
    return Promise.resolve(null);
  }),
}));

describe('PaymentModal', () => {
    it('render correctly when visible', async () => {
        const { findByText } = render(
          <StripeProvider publishableKey="test_key">
            <PaymentModal visible={true} onClose={jest.fn()} amount={10} description="Plan mensual" planType={''} />
          </StripeProvider>
        );

        await waitFor(() => {
          expect(findByText('Pago seguro con')).toBeTruthy();
          expect(findByText('10.00€/mes')).toBeTruthy();
          expect(findByText('Número de tarjeta')).toBeTruthy();
          expect(findByText('Fecha exp.')).toBeTruthy();
          expect(findByText('CVV')).toBeTruthy();
        });
      });
});
