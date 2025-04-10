import React from 'react';
import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((callback) => {
    return () => {};
  }),
}));

jest.mock('@/app/_util/useAuth', () => ({
  useAuth: () => ({
    getUserFromStorage: jest.fn().mockResolvedValue({ token: 'test-token' }),
    updateUser: jest.fn(),
  }),
}));

jest.mock('@/hooks/useAuth', () => ({
  __esModule: true,
  default: () => ({
    roles: [],
    expiredPlanDate: null,
  }),
}));

jest.mock('react-native', () => ({
  Dimensions: {
    get: () => ({ width: 500 }),
    addEventListener: () => ({ remove: jest.fn() }),
  },
  StyleSheet: {
    create: (styles: Record<string, any>) => styles,
  },
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  ActivityIndicator: 'ActivityIndicator',
}));

jest.mock('@/constants/Colors', () => ({
  GlobalStyles: {
    red: '#FF0000',
    blue: '#0000FF',
    grey: '#808080',
    lightGrey: '#D3D3D3',
    white: '#FFFFFF',
    darkGrey: '#333333',
    font: 'Arial',
    fontBold: 'Arial-Bold',
  },
}));

jest.mock('@/constants/Mysc', () => ({
  BACKEND_API: 'http://test-api.com',
}));

jest.mock('../CustomModal', () => 'CustomModal');
jest.mock('../CustomButton', () => 'CustomButton');
jest.mock('../ThemedText', () => ({ ThemedText: 'ThemedText' }));
jest.mock('../PaymentModal', () => 'PaymentModal');
jest.mock('../SucessCancelModel', () => ({ SuccessCancelModal: 'SuccessCancelModal' }));

import PlanCard from '../PlanCard';

describe('PlanCard', () => {
  it('renders without crashing', () => {
    const rendered = render(<PlanCard role="CUSTOMER" />);
    expect(rendered).toBeTruthy();
  });
}); 