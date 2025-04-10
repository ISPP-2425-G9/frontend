import React from 'react';
import { render } from '@testing-library/react-native';
import SecureField from '../SecureField';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  RN.Animated = {
    Value: jest.fn(() => ({
      interpolate: jest.fn(() => '0deg'),
    })),
    sequence: jest.fn(() => ({
      start: jest.fn(),
    })),
    spring: jest.fn(() => ({
      start: jest.fn(),
    })),
    timing: jest.fn(() => ({
      start: jest.fn(),
    })),
    View: RN.View,
  };
  
  return RN;
});

jest.mock('@stripe/react-stripe-js', () => ({
  CardNumberElement: jest.fn(() => null),
  CardExpiryElement: jest.fn(() => null),
  CardCvcElement: jest.fn(() => null),
}));

jest.mock('@/hooks/useResponsiveLayout', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  FontAwesome: () => <div data-testid="card-icon">💳</div>,
}));

describe('SecureField Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useResponsiveLayout as jest.Mock).mockReturnValue({ isMobile: false });
  });

  it('renders correctly with card number element', () => {
    const { getByText } = render(
      <SecureField 
        label="Número de tarjeta" 
        element={CardNumberElement} 
        isCardNumber={true} 
      />
    );
    
    expect(getByText('Número de tarjeta')).toBeTruthy();
  });

  it('renders correctly with card expiry element', () => {
    const { getByText } = render(
      <SecureField 
        label="Fecha de expiración" 
        element={CardExpiryElement} 
      />
    );
    
    expect(getByText('Fecha de expiración')).toBeTruthy();
  });

  it('renders correctly with card CVC element', () => {
    const { getByText } = render(
      <SecureField 
        label="CVC" 
        element={CardCvcElement} 
      />
    );
    
    expect(getByText('CVC')).toBeTruthy();
  });

  it('applies mobile styles when isMobile is true', () => {
    (useResponsiveLayout as jest.Mock).mockReturnValue({ isMobile: true });
    
    const { getByText } = render(
      <SecureField 
        label="Número de tarjeta" 
        element={CardNumberElement} 
        isCardNumber={true} 
      />
    );
    
    expect(getByText('Número de tarjeta')).toBeTruthy();
  });

  it('calls animation functions when focus state changes', () => {
    const mockSpring = jest.fn().mockReturnValue({ start: jest.fn() });
    
    const RN = jest.requireActual('react-native');
    RN.Animated.spring = mockSpring;
    
    render(
      <SecureField 
        label="Número de tarjeta" 
        element={CardNumberElement} 
        isCardNumber={true} 
      />
    );
    
    expect(mockSpring).toHaveBeenCalled();
  });

  it('handles card brand changes', () => {
    const mockOnChange = jest.fn();
    
    (CardNumberElement as jest.Mock).mockImplementation(({ onChange }) => {
      setTimeout(() => {
        onChange({ brand: 'visa', complete: true });
      }, 0);
      return null;
    });
    
    const mockSequence = jest.fn().mockReturnValue({ start: jest.fn() });
    const mockTiming = jest.fn().mockReturnValue({ start: jest.fn() });
    
    const RN = jest.requireActual('react-native');
    RN.Animated.sequence = mockSequence;
    RN.Animated.timing = mockTiming;
    
    render(
      <SecureField 
        label="Número de tarjeta" 
        element={CardNumberElement} 
        isCardNumber={true} 
      />
    );
    
    const onChangeHandler = (CardNumberElement as jest.Mock).mock.calls[0][0].onChange;
    onChangeHandler({ brand: 'visa', complete: true });
    
    expect(mockSequence).toHaveBeenCalled();
    expect(mockTiming).toHaveBeenCalled();
  });

  it('handles complete state', () => {
    const mockOnChange = jest.fn();
    
    (CardNumberElement as jest.Mock).mockImplementation(({ onChange }) => {
      setTimeout(() => {
        onChange({ complete: true });
      }, 0);
      return null;
    });
    
    render(
      <SecureField 
        label="Número de tarjeta" 
        element={CardNumberElement} 
        isCardNumber={true} 
      />
    );
    
    const onChangeHandler = (CardNumberElement as jest.Mock).mock.calls[0][0].onChange;
    onChangeHandler({ complete: true });
  });

  it('applies custom styles correctly', () => {
    const customStyle = { marginBottom: 20 };
    
    render(
      <SecureField 
        label="Número de tarjeta" 
        element={CardNumberElement} 
        isCardNumber={true}
        style={customStyle}
      />
    );
    
  });
}); 