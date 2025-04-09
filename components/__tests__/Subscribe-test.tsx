import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import PlanManagementView from '../../app/subscribe/index';
import { withAuth } from '../../app/_util/withAuth';
import { AUTHORITIES } from '../../app/_util/Authorities';
import useAuth from '@/hooks/useAuth';
import { NavigationContainer } from '@react-navigation/native';
import { NotificationProvider } from '@/context/NotificationContext';

// Mock de useAuth
jest.mock('@/hooks/useAuth');
jest.mock('@/components/PlanCard', () => 'PlanCard'); // Mock de PlanCard

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    getAllKeys: jest.fn(),
  }));

describe('PlanManagementView', () => {

  const renderWithNavigation = (component: React.ReactElement) => {
    return render(
      <NavigationContainer>
        <NotificationProvider>{component}</NotificationProvider>
      </NavigationContainer>
    );
  };
  
  beforeEach(() => {
    // Restablecemos el mock de useAuth antes de cada prueba
    useAuth.mockReset();
  });

  it('should render loading state when role is not defined', () => {
    useAuth.mockReturnValue({
      roles: null,
      expiredPlanDate: null,
    });
    const { getByTestId } = renderWithNavigation(<PlanManagementView />);
    // Verificar que el texto de carga se muestra
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

});
