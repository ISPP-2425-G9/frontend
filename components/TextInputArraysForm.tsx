import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import TextImput from './CustomTextInput';

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

const CustomForm: React.FC<CustomFormProps> = ({ title, description, inputs, onSubmit, style, buttonText = 'Enviar' }) => {
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
      {inputs.map((input) => (
        <View key={input.name} style={styles.inputContainer}>
          <TextImput
            placeholder={input.placeholder}
            style={input.style}
            secureTextEntry={input.secureTextEntry}
            onChangeText={(value) => handleChange(input.name, value)}
            value={formValues[input.name] || ''}
          />
        </View>
      ))}
      <Button title={buttonText} onPress={handleSubmit} />
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 10,
  },
});

export default CustomForm;
