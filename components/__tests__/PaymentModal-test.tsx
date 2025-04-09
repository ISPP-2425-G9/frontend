import { render, fireEvent, act } from '@testing-library/react-native';
import PaymentModal from '@/components/PaymentModal';
import { useAuth } from '@/app/_util/useAuth';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { BACKEND_API } from '@/constants/Mysc';
import useIsDesktop from '@/hooks/useResponsiveLayout';
import { ReactNode } from 'react';

// Declaración de tipo para loadedNativeFonts global
declare global {
  var loadedNativeFonts: string[];
}

// Mock de los hooks y módulos
jest.mock('@/app/_util/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-font', () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(),
}));

// Mock de las fuentes nativas
const mockLoadedFonts = {
  'DMSans_400Regular': true,
  'DMSans_500Medium': true,
  'DMSans_700Bold': true,
};

jest.mock('@expo-google-fonts/dm-sans', () => ({
  ...mockLoadedFonts,
  useFonts: jest.fn(() => [true, null]),
}));

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(),
}));

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: ReactNode }) => children,
  useStripe: jest.fn(),
  useElements: jest.fn(),
  CardNumberElement: 'CardNumberElement',
  CardExpiryElement: 'CardExpiryElement',
  CardCvcElement: 'CardCvcElement',
}));

jest.mock('@/hooks/useResponsiveLayout', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock global de las fuentes
global.loadedNativeFonts = Object.keys(mockLoadedFonts);

const mockStripe = {
  createPaymentMethod: jest.fn(),
};

const mockElements = {
  getElement: jest.fn(),
};

describe('PaymentModal', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    amount: 9.99,
    planType: 'PREMIUM',
    description: 'Plan Premium mensual',
    onSuccess: jest.fn(),
  };

  const mockUpdateUser = jest.fn();
  const mockGetUserFromStorage = jest.fn();
  const mockCardElement = {};

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      updateUser: mockUpdateUser,
      getUserFromStorage: mockGetUserFromStorage,
    });
    (useStripe as jest.Mock).mockReturnValue(mockStripe);
    (useElements as jest.Mock).mockReturnValue(mockElements);
    (useIsDesktop as jest.Mock).mockReturnValue({ isMobile: false });
    mockElements.getElement.mockReturnValue(mockCardElement);
    global.fetch = jest.fn();
  });

  it('renders correctly with all required elements', () => {
    const { getByText, getByTestId } = render(<PaymentModal {...defaultProps} />);
    
    expect(getByText('Pago seguro con')).toBeTruthy();
    expect(getByText('9.99€/mes')).toBeTruthy();
    expect(getByText('Plan Premium mensual')).toBeTruthy();
    expect(getByText('Cancelar')).toBeTruthy();
    expect(getByText('Pagar')).toBeTruthy();
  });

  it('closes modal when cancel button is pressed', () => {
    const { getByText } = render(<PaymentModal {...defaultProps} />);
    
    fireEvent.press(getByText('Cancelar'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('shows loading state during payment processing', async () => {
    mockStripe.createPaymentMethod.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    const { getByText, findByText } = render(<PaymentModal {...defaultProps} />);
    
    fireEvent.press(getByText('Pagar'));
    
    expect(await findByText('Procesando...')).toBeTruthy();
  });

  it('handles successful payment flow correctly', async () => {
    const mockPaymentMethod = { id: 'pm_123' };
    const mockUserData = { token: 'token123', id: 'user123' };
    const mockResponseData = {
      token: 'newToken123',
      roles: ['PREMIUM'],
      expiredPlanDate: '2024-12-31',
    };

    mockStripe.createPaymentMethod.mockResolvedValueOnce({ paymentMethod: mockPaymentMethod });
    mockGetUserFromStorage.mockResolvedValueOnce(mockUserData);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponseData),
    });

    const { getByText } = render(<PaymentModal {...defaultProps} />);

    await act(async () => {
      fireEvent.press(getByText('Pagar'));
    });

    expect(mockUpdateUser).toHaveBeenCalledWith({
      token: mockResponseData.token,
      roles: mockResponseData.roles,
      expiredPlanDate: mockResponseData.expiredPlanDate,
    });
    expect(defaultProps.onSuccess).toHaveBeenCalled();
  });

  it('handles payment creation errors correctly', async () => {
    const mockError = new Error('Invalid card');
    mockStripe.createPaymentMethod.mockRejectedValueOnce(mockError);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { getByText } = render(<PaymentModal {...defaultProps} />);

    await act(async () => {
      fireEvent.press(getByText('Pagar'));
      // Esperar a que se complete el procesamiento
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error al procesar el pago:',
      'Invalid card'
    );
    consoleSpy.mockRestore();
  });

  it('handles stripe not being initialized', async () => {
    (useStripe as jest.Mock).mockReturnValue(null);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const { getByText } = render(<PaymentModal {...defaultProps} />);

    await act(async () => {
      fireEvent.press(getByText('Pagar'));
      // Esperar a que se complete el procesamiento
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('handles stripe error without message', async () => {
    mockStripe.createPaymentMethod.mockRejectedValueOnce({});
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { getByText } = render(<PaymentModal {...defaultProps} />);

    await act(async () => {
      fireEvent.press(getByText('Pagar'));
      // Esperar a que se complete el procesamiento
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error al procesar el pago:',
      'Error desconocido al procesar el pago'
    );
    consoleSpy.mockRestore();
  });

  it('handles API errors correctly', async () => {
    const mockPaymentMethod = { id: 'pm_123' };
    const mockUserData = { token: 'token123', id: 'user123' };
    
    mockStripe.createPaymentMethod.mockResolvedValueOnce({ paymentMethod: mockPaymentMethod });
    mockGetUserFromStorage.mockResolvedValueOnce(mockUserData);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve('Error del servidor'),
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const { getByText } = render(<PaymentModal {...defaultProps} />);

    await act(async () => {
      fireEvent.press(getByText('Pagar'));
      // Esperar a que se complete el procesamiento
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error en el servidor:',
      'Error al actualizar el plan'
    );
    consoleSpy.mockRestore();
  });

  it('handles missing user data correctly', async () => {
    const mockPaymentMethod = { id: 'pm_123' };
    mockStripe.createPaymentMethod.mockResolvedValueOnce({ paymentMethod: mockPaymentMethod });
    mockGetUserFromStorage.mockResolvedValueOnce({});

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const { getByText } = render(<PaymentModal {...defaultProps} />);

    await act(async () => {
      fireEvent.press(getByText('Pagar'));
      // Esperar a que se complete el procesamiento
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error en el servidor:',
      'No se encontró el token de autenticación'
    );
    consoleSpy.mockRestore();
  });

  it('adapts to mobile layout correctly', () => {
    (useIsDesktop as jest.Mock).mockReturnValue({ isMobile: true });
    
    const { getByTestId } = render(<PaymentModal {...defaultProps} />);
    
    const middleRow = getByTestId('middle-row');
    expect(middleRow.props.style).toContainEqual(
      expect.objectContaining({
        flexDirection: 'column',
      })
    );
  });
}); 