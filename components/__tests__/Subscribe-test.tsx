import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import PlanManagementView from '../../app/subscribe/index';
import { withAuth } from '../../app/_util/withAuth';
import { AUTHORITIES } from '../../app/_util/Authorities';
import useAuth from '@/hooks/useAuth';
import { NavigationContainer } from '@react-navigation/native';
import { NotificationProvider } from '@/context/NotificationContext';

jest.mock('@/hooks/useAuth');

const MockedPlanCard = jest.fn(() => null);

jest.mock('@/components/PlanCard', () => MockedPlanCard);

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
    useAuth.mockReset();
    MockedPlanCard.mockClear();
  });

  it('should render loading state when role is not defined', () => {
    useAuth.mockReturnValue({
      roles: null,
      expiredPlanDate: null,
    });

    const { getByTestId } = renderWithNavigation(<PlanManagementView />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should not render loading state if roles are available', async () => {
    useAuth.mockReturnValue({
      roles: ['CUSTOMER_FREE'],
      expiredPlanDate: null,
    });

    renderWithNavigation(<PlanManagementView />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).toBeNull();
    });
  });

  it('should render the correct role-based PlanCard props', async () => {
    const expirationDate = new Date('2025-05-01');
    useAuth.mockReturnValue({
      roles: ['COMPANY_PREMIUM'],
      expiredPlanDate: expirationDate,
    });

    renderWithNavigation(<PlanManagementView />);
  });

});
