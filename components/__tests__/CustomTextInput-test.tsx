import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomTextInput from '../CustomTextInput';
import { GlobalStyles } from '@/constants/Colors';
import { View, TouchableOpacity } from 'react-native';

jest.mock('@expo/vector-icons', () => ({
  AntDesign: () => 'MockedIcon'
}));

describe('CustomTextInput', () => {
  it('debe renderizar correctamente', () => {
    const { getByPlaceholderText } = render(
      <CustomTextInput placeholder="Test placeholder" />
    );
    expect(getByPlaceholderText('Test placeholder')).toBeTruthy();
  });

  it('debe aplicar estilos de focus al recibir focus', () => {
    const { getByPlaceholderText, UNSAFE_getByType } = render(
      <CustomTextInput placeholder="Test placeholder" />
    );
    
    const input = getByPlaceholderText('Test placeholder');
    const container = UNSAFE_getByType(View);
    
    fireEvent(input, 'focus');
    
    const containerStyles = container.props.style;
    expect(containerStyles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          borderWidth: 2,
          backgroundColor: GlobalStyles.white,
          borderColor: GlobalStyles.blue,
        })
      ])
    );

    fireEvent(input, 'blur');
    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: GlobalStyles.lightGrey,
        })
      ])
    );
  });

  it('debe mostrar y ocultar contraseña al presionar el botón de toggle', () => {
    const { getByPlaceholderText, UNSAFE_getByType } = render(
      <CustomTextInput 
        placeholder="Password" 
        secureTextEntry={true}
        showPasswordToggle={true}
      />
    );

    const input = getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);

    const toggleButton = UNSAFE_getByType(TouchableOpacity);
    
    fireEvent.press(toggleButton);
    expect(input.props.secureTextEntry).toBe(false);

    fireEvent.press(toggleButton);
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('no debe mostrar el toggle de contraseña cuando showPasswordToggle es false', () => {
    const { UNSAFE_queryByType } = render(
      <CustomTextInput 
        placeholder="Password" 
        secureTextEntry={true}
        showPasswordToggle={false}
      />
    );

    const toggleButton = UNSAFE_queryByType(TouchableOpacity);
    expect(toggleButton).toBeNull();
  });

  it('debe aplicar estilos personalizados', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByPlaceholderText } = render(
      <CustomTextInput 
        placeholder="Test" 
        style={customStyle}
      />
    );

    const input = getByPlaceholderText('Test');
    expect(input.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle)
      ])
    );
  });

  it('debe manejar la entrada de texto correctamente', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <CustomTextInput 
        placeholder="Test" 
        onChangeText={onChangeText}
      />
    );

    const input = getByPlaceholderText('Test');
    fireEvent.changeText(input, 'test value');
    expect(onChangeText).toHaveBeenCalledWith('test value');
  });
}); 