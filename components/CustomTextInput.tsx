import { GlobalStyles } from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

type CustomTextInputProps = TextInputProps & {
  style?: object;
  placeholder?: string;
};

export const CustomTextInput: React.FC<CustomTextInputProps> = ({
  style,
  placeholder,
  secureTextEntry,
  ...props
}) => {
  const [hidePassword, setHidePassword] = useState(secureTextEntry || false);

  return (
    <View style={[styles.container]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={GlobalStyles.darkGrey}
        secureTextEntry={secureTextEntry ? hidePassword : false}
        {...props}
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setHidePassword(!hidePassword)}
        >
          <AntDesign name={hidePassword ? 'eyeo' : 'eye'} size={24} color={GlobalStyles.grey} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: GlobalStyles.lightGrey,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: GlobalStyles.lightGrey,
  },
  input: {
    fontFamily: GlobalStyles.font,
    fontSize: 16,
    flex: 1,
    minWidth: 200,
    height: 30,
    paddingHorizontal: 10,
    marginVertical: 7.5,
    color: GlobalStyles.darkGrey,
  },
  iconContainer: {
    padding: 5,
    marginRight: '1%',
  },
});

export default CustomTextInput;