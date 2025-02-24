import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';

type CustomTextInputProps = TextInputProps & {
  style?: object;
  placeholder?: string;
};

const TextImput: React.FC<CustomTextInputProps> = ({ style, placeholder, ...props }) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor={GlobalStyles.lightGrey}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: GlobalStyles.darkGrey,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: GlobalStyles.white,
    color: GlobalStyles.darkGrey,
  },
});

export default TextImput;
