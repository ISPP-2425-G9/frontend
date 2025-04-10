import { render, fireEvent } from '@testing-library/react-native';
import LogoutButton from '@/components/LogoutButton';
import { useAuth } from '@/app/_util/useAuth';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { ReactTestInstance } from 'react-test-renderer';

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

  it('should call logout, navigate and close modal when Confirmar is pressed', () => {
    const { getByText, queryByText } = render(<LogoutButton />);

    fireEvent.press(getByText('Cerrar sesión'));
    fireEvent.press(getByText('Confirmar'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('home');
    expect(queryByText('¿Estás seguro que deseas cerrar sesión?')).toBeNull();
  });

  it('should close the modal when Cancelar is pressed', () => {
    const { getByText, queryByText } = render(<LogoutButton />);

    fireEvent.press(getByText('Cerrar sesión'));
    fireEvent.press(getByText('Cancelar'));

    expect(queryByText('¿Estás seguro que deseas cerrar sesión?')).toBeNull();
  });

  it('should handle logout errors correctly and close modal', () => {
    const error = new Error('Logout failed');
    mockLogout.mockImplementation(() => {
      throw error;
    });

    const { getByText, queryByText } = render(<LogoutButton />);

    fireEvent.press(getByText('Cerrar sesión'));
    fireEvent.press(getByText('Confirmar'));

    expect(mockConsoleError).toHaveBeenCalledWith('Error al cerrar sesión:', error);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(queryByText('¿Estás seguro que deseas cerrar sesión?')).toBeNull();
  });

  it('should apply correct styles to modal and its components', () => {
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

    const modalText = getByText('¿Estás seguro que deseas cerrar sesión?');
    expect(modalText.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 16,
          lineHeight: 24,
          fontFamily: 'DMSans_500Medium',
          color: '#434343'
        }),
        expect.objectContaining({
          textAlign: 'center',
          marginBottom: 20,
          fontSize: 16,
        })
      ])
    );

    const buttonsContainer = modalContent.props.children[1];
    expect(buttonsContainer.props.style).toEqual(
      expect.objectContaining({
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
      })
    );

    const cancelButton = getByText('Cancelar');
    const confirmButton = getByText('Confirmar');
    expect(cancelButton).toBeTruthy();
    expect(confirmButton).toBeTruthy();

    expect(buttonsContainer.props.children).toHaveLength(2);
    buttonsContainer.props.children.forEach((button: ReactTestInstance) => {
      expect(button.props.style).toEqual(
        expect.objectContaining({
          flex: 1,
          paddingVertical: 12,
          borderRadius: 8,
          marginHorizontal: 5,
        })
      );
    });
  });
});
