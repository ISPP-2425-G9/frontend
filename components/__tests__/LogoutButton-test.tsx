import { render, fireEvent } from '@testing-library/react-native';
import LogoutButton from '@/components/LogoutButton';
import { useAuth } from '@/app/_util/useAuth';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

jest.mock('expo-font', () => ({
    isLoaded: jest.fn(() => true),
    loadAsync: jest.fn(),
  }));
  
jest.mock('@/app/_util/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('LogoutButton', () => {
  let mockLogout: jest.Mock;
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockLogout = jest.fn();
    mockNavigate = jest.fn();
    mockConsoleError.mockClear();

    (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  it('should render the button correctly', () => {
    const { getByText } = render(<LogoutButton />);
    expect(getByText('Cerrar sesión')).toBeTruthy();
  });

  it('should show the modal when the button is pressed', () => {
    const { getByText, queryByText } = render(<LogoutButton />);

    fireEvent.press(getByText('Cerrar sesión'));
    expect(queryByText('¿Estás seguro que deseas cerrar sesión?')).toBeTruthy();
  });

  it('should call logout and navigate when Confirmar is pressed', () => {
    const { getByText } = render(<LogoutButton />);

    fireEvent.press(getByText('Cerrar sesión'));
    fireEvent.press(getByText('Confirmar'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('home');
  });

  it('should close the modal when Cancelar is pressed', () => {
    const { getByText, queryByText } = render(<LogoutButton />);

    fireEvent.press(getByText('Cerrar sesión'));
    fireEvent.press(getByText('Cancelar'));

    expect(queryByText('¿Estás seguro que deseas cerrar sesión?')).toBeNull();
  });

  it('should handle logout errors correctly', () => {
    const error = new Error('Logout failed');
    mockLogout.mockImplementation(() => {
      throw error;
    });

    const { getByText } = render(<LogoutButton />);

    fireEvent.press(getByText('Cerrar sesión'));
    fireEvent.press(getByText('Confirmar'));

    expect(mockConsoleError).toHaveBeenCalledWith('Error al cerrar sesión:', error);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should apply correct styles to modal content', () => {
    const { getByText, getByTestId } = render(<LogoutButton />);

    fireEvent.press(getByText('Cerrar sesión'));

    const modalContent = getByTestId('logout-modal-content');
    expect(modalContent.props.style).toEqual(
      expect.objectContaining({
        width: '90%',
        maxWidth: 400,
        padding: '2%',
      })
    );
  });
});
