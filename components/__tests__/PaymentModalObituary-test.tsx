import React from 'react';
import { render } from '@testing-library/react-native';
import PaymentModalObituary from '../PaymentModalObituary';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useFocusEffect: jest.fn((callback) => {
    callback();
    return () => {};
  }),
}));

jest.mock('@stripe/stripe-react-native', () => ({
  CardField: () => <div data-testid="card-field" />,
  useStripe: () => ({
    initPaymentSheet: jest.fn(),
    presentPaymentSheet: jest.fn(),
  }),
  CardFieldInput: {
    ValidationState: {
      Valid: 'Valid',
      Invalid: 'Invalid',
      Incomplete: 'Incomplete',
    },
  },
}));

jest.mock('../CustomModal', () => ({
  __esModule: true,
  default: ({ children, visible, onClose }: { 
    children?: React.ReactNode; 
    visible: boolean; 
    onClose: () => void; 
  }) => (
    visible ? <div>{children}</div> : null
  ),
}));

jest.mock('../CustomButton', () => ({
  __esModule: true,
  default: ({ onPress, title }: { 
    onPress: () => void; 
    title: string; 
  }) => (
    <button onClick={onPress}>{title}</button>
  ),
}));

jest.mock('../SecureField', () => {
  return {
    __esModule: true,
    default: function MockSecureField() {
      return null;
    },
  };
});

jest.mock('../SuccessModalObituary', () => ({
  __esModule: true,
  default: ({ visible, onClose }: { 
    visible: boolean; 
    onClose: () => void; 
  }) => (
    visible ? <div>Success Modal</div> : null
  ),
}));

jest.mock('@/constants/Colors', () => ({
  GlobalStyles: {
    colors: {
      text: '#000000',
      background: '#FFFFFF',
    },
  },
}));

jest.mock('@/constants/Stripe', () => ({
  STRIPE_PUBLISHABLE_KEY: 'test_key',
}));

jest.mock('react-native', () => ({
  View: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
  StyleSheet: {
    create: (styles: Record<string, any>) => styles,
  },
  Platform: {
    OS: 'web',
  },
}));

jest.mock('@expo/vector-icons', () => ({
  FontAwesome: jest.fn(() => null),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

jest.mock('@/hooks/useResponsiveLayout', () => ({
  __esModule: true,
  default: jest.fn(() => ({ isMobile: false })),
}));

describe('PaymentModalObituary', () => {
  const mockProps = {
    visible: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
    price: 100,
    amount: 10000,
    description: 'Test Obituary Payment',
    planType: "basic"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<PaymentModalObituary {...mockProps} />);
  });
}); 