import { GlobalStyles } from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';

type CustomTextInputProps = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;  
  style?: StyleProp<TextStyle>;          
  placeholder?: string;
  showPasswordToggle?: boolean;
};

export const CustomTextInput: React.FC<CustomTextInputProps> = ({
  containerStyle,
  style,
  placeholder,
  secureTextEntry,
  showPasswordToggle = true,
  ...props
}) => {
  const [hidePassword, setHidePassword] = useState(secureTextEntry || false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[
      styles.container,
      isFocused && styles.containerFocused,
      containerStyle,
    ]}>
      <TextInput
        style={[
          styles.input,
          style,
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
      {secureTextEntry && showPasswordToggle && (
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
