import React from 'react';
import { Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  color?: 'blue' | 'grey' | 'red' | 'white';
};

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, style, color = 'blue' }) => {
  const buttonStyles = [styles.button, styles[color], style];
  const textStyles = [styles.textWhite, color === 'white' ? styles.textGrey : styles.textWhite];

  return (
    <Pressable style={buttonStyles} onPress={onPress}>
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
  textWhite: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  textGrey: {
    color: '#434343',
    fontWeight: 'bold',
  },
});

export default CustomButton;
