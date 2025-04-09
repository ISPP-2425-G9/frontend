import { render, fireEvent } from '@testing-library/react-native';
import LogoutButton from '@/components/LogoutButton';
import { useAuth } from '@/app/_util/useAuth';
import { useNavigation } from '@react-navigation/native';

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

describe('LogoutButton', () => {
  let mockLogout: jest.Mock;
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockLogout = jest.fn();
    mockNavigate = jest.fn();

    (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
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

    // Open the modal by pressing the "Cerrar sesión" button
    fireEvent.press(getByText('Cerrar sesión'));

    // Press the "Cancelar" button inside the modal
    fireEvent.press(getByText('Cancelar'));

    // Ensure that the modal is closed after pressing Cancelar
    expect(queryByText('¿Estás seguro que deseas cerrar sesión?')).toBeNull();
  });
});
