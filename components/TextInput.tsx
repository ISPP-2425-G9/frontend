import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';

type CustomTextInputProps = TextInputProps & {
  style?: object;
  placeholder?: string;
};



export const CustomTextInput: React.FC<CustomTextInputProps> = ({ style, placeholder, ...props }) => {
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
    fontFamily: GlobalStyles.font,
    fontSize: 16,
    width: 400,
    height: 40,
    borderColor: GlobalStyles.lightGrey,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginVertical: 7.5,
    backgroundColor: GlobalStyles.lightGrey,
    color: GlobalStyles.darkGrey,
    placeholderTextColor: GlobalStyles.grey,
  },
});

export default TextInput;
