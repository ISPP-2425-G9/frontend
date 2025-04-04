import { GlobalStyles } from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[
      styles.container,
      isFocused && styles.containerFocused,
    ]}>
      <TextInput
        style={[
          styles.input,
          Platform.OS === 'web' ? { outline: 'none' } : {},
        ]}
        placeholder={placeholder}
        placeholderTextColor={GlobalStyles.darkGrey}
        secureTextEntry={secureTextEntry ? hidePassword : false}
        selectionColor={GlobalStyles.lightGrey}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
  containerFocused: {
    borderWidth: 2,
    backgroundColor: GlobalStyles.white,
    borderColor: GlobalStyles.blue,
    shadowColor: GlobalStyles.blue,
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
});

export default CustomTextInput;