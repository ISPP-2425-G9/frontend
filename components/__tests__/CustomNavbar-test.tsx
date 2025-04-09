import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomNavbar from '../CustomNavbar';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import useAuth from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useNavigationState: jest.fn(),
}));

jest.mock('@/hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  clear: jest.fn(),
}));

jest.mock('react-native', () => {
  return {
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    Image: 'Image',
    StyleSheet: {
      create: jest.fn(styles => styles),
      flatten: jest.fn(style => style),
    },
    useWindowDimensions: jest.fn().mockReturnValue({
      width: 400, 
      height: 800,
    }),
  };
});

jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('../CustomButton', () => 'CustomButton');

jest.mock('../CustomModal', () => 'CustomModal');

jest.mock('../ThemedText', () => ({
  ThemedText: 'ThemedText',
}));

jest.mock('@/constants/Colors', () => ({
  GlobalStyles: {
    blue: '#007AFF',
    darkGrey: '#333333',
    lightGrey: '#F5F5F5',
    font: 'System',
  },
}));

describe('CustomNavbar', () => {
  const mockNavigate = jest.fn();
  const mockSetState = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });
    
    (useNavigationState as jest.Mock).mockReturnValue('home');
    
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      roles: [],
      name: null,
    });
    
    jest.spyOn(React, 'useState').mockImplementation((initialState: unknown) => {
      return [initialState, mockSetState];
    });
  });
  
  it('renders correctly with default props', () => {
    const { getByText } = render(<CustomNavbar />);
    
    expect(getByText('Inicio')).toBeTruthy();
  });
  
  it('renders correctly in narrow screen mode', () => {
    const { useWindowDimensions } = require('react-native');
    (useWindowDimensions as jest.Mock).mockReturnValue({
      width: 400, 
      height: 800,
    });
    
    const { getByText } = render(<CustomNavbar />);
    
    expect(getByText('Inicio')).toBeTruthy();
  });
  
  it('renders correctly when authenticated as admin', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      roles: ['ADMIN'],
      name: 'Admin User',
    });
    
    const { getByText } = render(<CustomNavbar />);
    
    expect(getByText('Inicio')).toBeTruthy();
  });
  
  it('renders correctly when authenticated as customer', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      roles: ['CUSTOMER'],
      name: 'Customer User',
    });
    
    const { getByText } = render(<CustomNavbar />);
    
    expect(getByText('Inicio')).toBeTruthy();
  });
  
  it('renders correctly when authenticated as customer premium', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      roles: ['CUSTOMER_PREMIUM'],
      name: 'Premium User',
    });
    
    const { getByText } = render(<CustomNavbar />);
    
    expect(getByText('Inicio')).toBeTruthy();
  });
  
  it('renders correctly when authenticated as company', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      roles: ['COMPANY'],
      name: 'Company User',
    });
    
    const { getByText } = render(<CustomNavbar />);
    
    expect(getByText('Inicio')).toBeTruthy();
  });
  
  it('navigates to home when logo is pressed', () => {
    const { UNSAFE_getAllByType } = render(<CustomNavbar />);
    
    const touchableOpacityComponents = UNSAFE_getAllByType('TouchableOpacity');
    
    const logoTouchableOpacity = touchableOpacityComponents[0];
    
    fireEvent.press(logoTouchableOpacity);
    
    expect(mockNavigate).toHaveBeenCalledWith('home');
  });
  
  it('updates title based on current route', () => {
    (useNavigationState as jest.Mock).mockReturnValue('certificate/index');
    
    const { getByText } = render(<CustomNavbar />);
    
    expect(getByText('Subir certificado')).toBeTruthy();
  });
  
  it('handles logout correctly', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      roles: ['CUSTOMER'],
      name: 'User',
    });
    
    const modalState = { value: true };
    jest.spyOn(React, 'useState').mockImplementation((initialState: unknown) => {
      if (initialState === false && mockSetState.mock.calls.length === 0) {
        return [modalState.value, (newValue: unknown) => {
          modalState.value = newValue as boolean;
          mockSetState(newValue);
        }];
      }
      return [initialState, mockSetState];
    });
    
    jest.mock('../CustomModal', () => {
      return function MockCustomModal({ children }: { children: React.ReactNode }) {
        return <>{children}</>;
      };
    });
    
    const { UNSAFE_getAllByType } = render(<CustomNavbar />);
    
    const customButtons = UNSAFE_getAllByType('CustomButton');
    
    const confirmButton = customButtons[1];
    
    fireEvent.press(confirmButton);
    
    expect(AsyncStorage.clear).toHaveBeenCalled();
    
    expect(mockNavigate).toHaveBeenCalledWith('home');
  });
});