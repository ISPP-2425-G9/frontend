import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddRecipientsModal from '../AddReceipentsModal';
import { GlobalStyles } from '@/constants/Colors';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('@/constants/Colors', () => ({
  GlobalStyles: {
    darkGrey: '#333',
    white: '#fff',
    blue: '#007AFF',
    red: '#FF3B30',
    lightGrey: '#f0f0f0',
  },
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native/jest/mockComponent');
  
  RN.Modal = 'Modal';
  
  RN.View = 'View';
  
  RN.Text = 'Text';
  
  RN.TextInput = 'TextInput';
  
  RN.TouchableOpacity = 'TouchableOpacity';
  
  RN.FlatList = ({ data, renderItem }) => {
    return (
      <RN.View>
        {data.map((item, index) => renderItem({ item, index }))}
      </RN.View>
    );
  };
  
  RN.StyleSheet = {
    create: (styles: any) => styles,
    flatten: (styles: any) => styles,
  };
  
  return RN;
});

describe('AddRecipientsModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();
  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    emails: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(
      <AddRecipientsModal {...defaultProps} />
    );

    expect(getByText('Añadir destinatarios')).toBeTruthy();
    
    expect(getByText('Cancelar')).toBeTruthy();
    expect(getByText('Confirmar')).toBeTruthy();
  });

  it('renders with initial emails', () => {
    const initialEmails = ['test1@example.com', 'test2@example.com'];
    const { getByText } = render(
      <AddRecipientsModal {...defaultProps} emails={initialEmails} />
    );

    expect(getByText('test1@example.com')).toBeTruthy();
    expect(getByText('test2@example.com')).toBeTruthy();
  });

  it('calls onClose when the cancel button is pressed', () => {
    const { getByText } = render(
      <AddRecipientsModal {...defaultProps} />
    );

    const cancelButton = getByText('Cancelar');
    fireEvent.press(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm with the email list when the confirm button is pressed', () => {
    const initialEmails = ['test1@example.com', 'test2@example.com'];
    const { getByText } = render(
      <AddRecipientsModal {...defaultProps} emails={initialEmails} />
    );

    const confirmButton = getByText('Confirmar');
    fireEvent.press(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledWith(initialEmails);
  });
});