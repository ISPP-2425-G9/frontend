import React from 'react';
import { render } from '@testing-library/react-native';
import NotFoundScreen from '../+not-found';

// Mock de useNavigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock de useFocusEffect
jest.mock('expo-router', () => ({
  useFocusEffect: jest.fn((callback) => callback()),
}));

describe('NotFoundScreen', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('should navigate to home screen when mounted', () => {
    render(<NotFoundScreen />);
    
    // Verificar que se llamó a navigate con 'home'
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('home');
  });

  it('should return null as its render output', () => {
    const { toJSON } = render(<NotFoundScreen />);
    expect(toJSON()).toBeNull();
  });
}); 