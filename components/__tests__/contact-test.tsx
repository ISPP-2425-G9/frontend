import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import '@testing-library/jest-dom';
import Contact from '@/app/contact';

jest.mock('expo-font', () => ({
  isLoaded: true,
  useFonts: () => [true],
}));

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useFocusEffect: jest.fn(),
    useNavigation: jest.fn().mockReturnValue({ navigate: jest.fn() }),
  }));
  
  jest.mock('react-native/Libraries/Linking/Linking', () => ({
    openURL: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
  
  jest.mock('react-native-vector-icons/FontAwesome6', () => {
    return {
      __esModule: true,
      default: 'FontAwesome6',
    };
  });
  

describe('Contact Screen', () => {

  const renderWithNavigation = (component) => {
    return render(
      <NavigationContainer>
        {component}
      </NavigationContainer>
    );
  };

  it('render properly form fields', () => {
    const { getByPlaceholderText } = renderWithNavigation(<Contact />);

    expect(getByPlaceholderText('Nombre')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Tu mensaje')).toBeTruthy();
  });

  it('calls Linking.openURL when send button is pressed', () => {
    const { getByText, getByPlaceholderText } = renderWithNavigation(<Contact />);

    const nameInput = getByPlaceholderText('Nombre');
    const emailInput = getByPlaceholderText('Email');
    const messageInput = getByPlaceholderText('Tu mensaje');

    fireEvent.changeText(nameInput, 'Juan Pérez');
    fireEvent.changeText(emailInput, 'juan.perez@example.com');
    fireEvent.changeText(messageInput, 'Tengo una pregunta');

    const sendButton = getByText('Enviar');
    fireEvent.press(sendButton);

    expect(Linking.openURL).toHaveBeenCalledTimes(1);
  });

  it('show alert when trying to send blank values', () => {
    global.alert = jest.fn();
    const { getByText } = renderWithNavigation(<Contact />);
    const sendButton = getByText('Enviar');
    fireEvent.press(sendButton);
    expect(global.alert).toHaveBeenCalledWith('Por favor, llena todos los campos.');
  });


  it('open email link when pressing email', () => {
    const { getByText } = renderWithNavigation(<Contact />);

    const emailLink = getByText('info@caronte.site');
    fireEvent.press(emailLink);

    expect(Linking.openURL).toHaveBeenCalledWith('mailto:info@caronte.site');
  });
  
});
