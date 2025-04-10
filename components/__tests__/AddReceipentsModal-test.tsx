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
  
  RN.FlatList = ({ data, renderItem, keyExtractor }: { 
    data: any[], 
    renderItem: (info: { item: any, index: number }) => React.ReactElement,
    keyExtractor?: (item: any) => string
  }) => {
    const keys = data.map(item => keyExtractor ? keyExtractor(item) : item);
    
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
    const { getByText, getByPlaceholderText } = render(
      <AddRecipientsModal {...defaultProps} />
    );

    expect(getByText('Añadir destinatarios')).toBeTruthy();
    
    expect(getByPlaceholderText('Introduce el correo')).toBeTruthy();
    
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

  it('uses default empty array when emails prop is not provided', () => {
    const propsWithoutEmails = {
      visible: true,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    };
    
    const { getByText } = render(
      <AddRecipientsModal {...propsWithoutEmails} />
    );
    
    expect(getByText('Añadir destinatarios')).toBeTruthy();
    expect(getByText('Confirmar')).toBeTruthy();
    
    const confirmButton = getByText('Confirmar');
    fireEvent.press(confirmButton);
    
    expect(mockOnConfirm).toHaveBeenCalledWith([]);
  });

  it('adds a new email when the add button is pressed', () => {
    const { getByPlaceholderText, getByText, UNSAFE_getAllByType } = render(
      <AddRecipientsModal {...defaultProps} />
    );

    const input = getByPlaceholderText('Introduce el correo');
    
    fireEvent.changeText(input, 'new@example.com');
    
    const touchableOpacities = UNSAFE_getAllByType('TouchableOpacity');
    const addButton = touchableOpacities[1];
    
    fireEvent.press(addButton);

    expect(getByText('new@example.com')).toBeTruthy();
  });

  it('adds a new email when the submit button is pressed on the keyboard', () => {
    const { getByPlaceholderText, getByText } = render(
      <AddRecipientsModal {...defaultProps} />
    );

    const input = getByPlaceholderText('Introduce el correo');

    fireEvent.changeText(input, 'new@example.com');
    fireEvent(input, 'submitEditing');

    expect(getByText('new@example.com')).toBeTruthy();
  });

  it('does not add duplicate emails', () => {
    const initialEmails = ['test@example.com'];
    const { getByPlaceholderText, queryAllByText, UNSAFE_getAllByType } = render(
      <AddRecipientsModal {...defaultProps} emails={initialEmails} />
    );

    const input = getByPlaceholderText('Introduce el correo');
    
    const touchableOpacities = UNSAFE_getAllByType('TouchableOpacity');
    const addButton = touchableOpacities[1];

    fireEvent.changeText(input, 'test@example.com');
    fireEvent.press(addButton);

    expect(queryAllByText('test@example.com')).toHaveLength(1);
  });

  it('does not add empty emails', () => {
    const { getByPlaceholderText, queryByText, UNSAFE_getAllByType } = render(
      <AddRecipientsModal {...defaultProps} />
    );

    const input = getByPlaceholderText('Introduce el correo');
    
    const touchableOpacities = UNSAFE_getAllByType('TouchableOpacity');
    const addButton = touchableOpacities[1];

    fireEvent.changeText(input, '   ');
    fireEvent.press(addButton);

    expect(queryByText('   ')).toBeNull();
  });

  it('removes an email when the trash icon is pressed', () => {
    const initialEmails = ['test@example.com'];
    const { getByText, queryByText, UNSAFE_getAllByType } = render(
      <AddRecipientsModal {...defaultProps} emails={initialEmails} />
    );

    expect(getByText('test@example.com')).toBeTruthy();

    const touchableOpacities = UNSAFE_getAllByType('TouchableOpacity');
    const trashIcon = touchableOpacities[2];
    
    fireEvent.press(trashIcon);

    expect(queryByText('test@example.com')).toBeNull();
  });

  it('calls onClose when the close button is pressed', () => {
    const { UNSAFE_getAllByType } = render(
      <AddRecipientsModal {...defaultProps} />
    );

    const touchableOpacities = UNSAFE_getAllByType('TouchableOpacity');
    const closeButton = touchableOpacities[0];
    
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
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

  it('calls onConfirm with updated email list when emails are added and removed', () => {
    const initialEmails = ['test1@example.com'];
    const { getByPlaceholderText, getByText, UNSAFE_getAllByType } = render(
      <AddRecipientsModal {...defaultProps} emails={initialEmails} />
    );

    const input = getByPlaceholderText('Introduce el correo');
    fireEvent.changeText(input, 'test2@example.com');
    fireEvent(input, 'submitEditing');

    const touchableOpacities = UNSAFE_getAllByType('TouchableOpacity');
    const trashIcon = touchableOpacities[2];
    
    fireEvent.press(trashIcon);

    const confirmButton = getByText('Confirmar');
    fireEvent.press(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledWith(['test2@example.com']);
  });

  it('uses keyExtractor function for FlatList items', () => {
    const keyExtractorSpy = jest.fn(item => item);
    
    const originalFlatList = require('react-native').FlatList;
    require('react-native').FlatList = ({ data, keyExtractor }) => {
      data.forEach(item => keyExtractorSpy(item));
      return null;
    };
    
    const initialEmails = ['test1@example.com', 'test2@example.com'];
    render(
      <AddRecipientsModal {...defaultProps} emails={initialEmails} />
    );
    
    expect(keyExtractorSpy).toHaveBeenCalledTimes(2);
    expect(keyExtractorSpy).toHaveBeenCalledWith('test1@example.com');
    expect(keyExtractorSpy).toHaveBeenCalledWith('test2@example.com');
    
    require('react-native').FlatList = originalFlatList;
  });
});