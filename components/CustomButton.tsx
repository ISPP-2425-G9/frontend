import React from 'react';
import { Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  color?: 'blue' | 'grey' | 'red' | 'white' | 'green';
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, style, color = 'blue', disabled = false }) => {
  const textStyles = [styles.text, color === 'white' ? styles.textGrey : styles.textWhite];
  const buttonStyles = [
    styles.button,
    styles[color],
    disabled && styles.disabled,
    style
  ];

  return (
    <Pressable 
      style={buttonStyles} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={textStyles}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 40,
  },
  blue: {
    backgroundColor: GlobalStyles.blue,
  },
  grey: {
    backgroundColor: GlobalStyles.darkGrey,
  },
  red: {
    backgroundColor: GlobalStyles.red, 
  },
  white: {
    backgroundColor: GlobalStyles.white,
  },
  green: {
    backgroundColor: GlobalStyles.green,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    textAlign: 'center', 
    fontWeight: 'bold',
  },
  textWhite: {
    color: GlobalStyles.white,
  },
  textGrey: {
    color: GlobalStyles.darkGrey,
  },
});

export default CustomButton;
