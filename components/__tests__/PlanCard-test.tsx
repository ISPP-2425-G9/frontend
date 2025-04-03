import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import PlanCard from '@/components/PlanCard';
import { NavigationContainer } from '@react-navigation/native'; 
import { useAuth } from '@/app/_util/useAuth';
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock('@/app/_util/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('PlanCard Component', () => {
  const mockLogin = jest.fn();
  const mockUserData = {
    token: 'mock_token',
    id: 'user123',
    roles: ['CUSTOMER_PREMIUM'],
    username: 'testuser',
    name: 'Test User',
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUserData));
  });

  it('renders correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <PlanCard role="CUSTOMER_PREMIUM" userId="user123" />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('PLAN MENSUAL - PROGRAMA TUS MENSAJES DE DESPEDIDA')).toBeTruthy();
      expect(getByText('0.99€/mes')).toBeTruthy();
    });
  });


});
