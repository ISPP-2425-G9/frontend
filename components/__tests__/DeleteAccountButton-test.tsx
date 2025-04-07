import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DeleteAccountButton from '../DeleteAccountButton';


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

  it('debe cerrar el modal cuando se presiona el botón "Cancelar"', async () => {
    const { getByText, queryByText } = render(<DeleteAccountButton />);

    fireEvent.press(getByText('Eliminar cuenta'));

    fireEvent.press(getByText('Cancelar'));

    await waitFor(() => {
      const modalText = queryByText('¿Estás seguro que deseas eliminar tu cuenta permanentemente?');
      expect(modalText).toBeNull();
    });
  });

});
