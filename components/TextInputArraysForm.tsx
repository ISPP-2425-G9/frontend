import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomTextInput from './CustomTextInput';

interface InputField {
  name: string;
  placeholder: string;
  style?: object;
  secureTextEntry?: boolean;
}

interface CustomFormProps {
  title: string;
  description?: string;
  inputs: InputField[];
  onSubmit: (values: Record<string, string>) => void;
  style?: object;
  buttonText?: string;
}

const TextInputArraysForm: React.FC<CustomFormProps> = ({ title, description, inputs, onSubmit, style, buttonText = 'Enviar' }) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formValues);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      <View style={styles.inputsWrapper}>
        {inputs.map((input) => (
          <View key={input.name} style={styles.inputContainer}>
            <CustomTextInput
              placeholder={input.placeholder}
              style={[styles.input, input.style]}
              secureTextEntry={input.secureTextEntry}
              onChangeText={(value) => handleChange(input.name, value)}
              value={formValues[input.name] || ''}
            />
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputsWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TextInputArraysForm;
