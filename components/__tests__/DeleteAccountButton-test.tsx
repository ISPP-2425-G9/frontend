import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DeleteAccountButton from '../DeleteAccountButton';
import { BACKEND_API } from '@/constants/Mysc';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace
  })
}));

jest.mock('react-native-vector-icons/FontAwesome6', () => {
  return {
    __esModule: true,
    default: 'FontAwesome6',
  };
});

jest.mock('expo-font');
jest.mock('@expo/vector-icons', () => ({
  AntDesign: jest.fn(() => null),
}));

describe('DeleteAccountButton', () => {
  const mockLocalStorage = {
    getItem: jest.fn(),
    clear: jest.fn(),
  };
  const mockFetch = jest.fn();

  beforeAll(() => {
    global.localStorage = mockLocalStorage as any;
    global.fetch = mockFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'authToken') return 'test-token';
      if (key === 'userId') return '123';
      return null;
    });
  });

  it('debe cerrar el modal cuando se presiona el botón "Cancelar"', async () => {
    const { getByText, queryByText } = render(<DeleteAccountButton />);

    fireEvent.press(getByText('Eliminar cuenta'));
    fireEvent.press(getByText('Cancelar'));

    await waitFor(() => {
      const modalText = queryByText('¿Estás seguro que deseas eliminar tu cuenta permanentemente?');
      expect(modalText).toBeNull();
    });
  });

  it('debe eliminar la cuenta exitosamente y redirigir a login', async () => {
    mockFetch.mockImplementationOnce(() => Promise.resolve({
      status: 204
    }));

    const { getByText } = render(<DeleteAccountButton />);
    
    fireEvent.press(getByText('Eliminar cuenta'));
    fireEvent.press(getByText('Eliminar'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        `${BACKEND_API}/api/auth/123`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer test-token'
          }
        }
      );
      
      expect(mockLocalStorage.clear).toHaveBeenCalled();
      
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });

  it('debe manejar errores en la eliminación de cuenta', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

    const { getByText, queryByText } = render(<DeleteAccountButton />);
    
    fireEvent.press(getByText('Eliminar cuenta'));
    fireEvent.press(getByText('Eliminar'));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      const modalText = queryByText('¿Estás seguro que deseas eliminar tu cuenta permanentemente?');
      expect(modalText).toBeNull();
    });

    consoleErrorSpy.mockRestore();
  });

  it('debe manejar respuesta no exitosa del servidor', async () => {
    mockFetch.mockImplementationOnce(() => Promise.resolve({
      status: 400
    }));

    const { getByText } = render(<DeleteAccountButton />);
    
    fireEvent.press(getByText('Eliminar cuenta'));
    fireEvent.press(getByText('Eliminar'));

    await waitFor(() => {
      expect(mockLocalStorage.clear).not.toHaveBeenCalled();
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });
});
