import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CustomTextInput from './CustomTextInput';
import { AntDesign } from '@expo/vector-icons';
import { GlobalStyles } from '@/constants/Colors';
import { ThemedText } from './ThemedText';

export interface InputField {
  name: string;
  placeholder: string;
  style?: object;
  secureTextEntry?: boolean;
  description?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad';
}

interface CustomFormProps {
  title: string;
  description?: string;
  inputs: InputField[];
  imageFields?: string[];
  onSubmit: (values: Record<string, string | { uri: string; name: string; type: string }>) => void;
  handleFormClose?: () => void;
  style?: object;
  buttonText?: string;
}

const TextInputArraysForm: React.FC<CustomFormProps> = ({
  title,
  description,
  inputs,
  imageFields = [],
  onSubmit,
  handleFormClose,
  style,
  buttonText = 'Enviar',
}) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [images, setImages] = useState<Record<string, string | null>>(
    imageFields.reduce((acc, field) => ({ ...acc, [field]: null }), {})
  );

  const handleChange = (name: string, value: string) => {
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const pickImage = async (field: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prevImages) => ({ ...prevImages, [field]: result.assets[0].uri }));
    }
  };

  const handleSubmit = () => {
    const formData: Record<string, string | { uri: string; name: string; type: string }> = { ...formValues };

    Object.entries(images).forEach(([key, uri]) => {
      if (uri) {
        const imageName = uri.split('/').pop();
        const imageType = imageName?.split('.').pop();
        formData[key] = {
          uri,
          name: imageName || 'image.jpg',
          type: `image/${imageType}`,
        };
      }
    });

    onSubmit(formData);
  };

  return (
    <View style={[styles.container, style]}>
      {handleFormClose && (
        <TouchableOpacity style={styles.closeButton} onPress={handleFormClose} testID='close-button'>
          <AntDesign name="close" size={24} color="#333" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      <View style={styles.inputsWrapper}>
        {inputs.map((input) => (
          <View key={input.name} style={styles.inputContainer}>
            <ThemedText>{input.description}</ThemedText>
            <CustomTextInput
              placeholder={input.placeholder}
              style={[styles.input, input.style]}
              secureTextEntry={input.secureTextEntry}
              keyboardType={input.keyboardType || 'default'}
              onChangeText={(value) => {handleChange(input.name, value)}}
              value={formValues[input.name] || ''}
            />
          </View>
        ))}
      </View>

      {imageFields.map((field) => (
        <View key={field} style={styles.imageContainer}>
          <TouchableOpacity style={styles.uploadButton} onPress={() => {pickImage(field)}}>
            <Text style={styles.buttonText}>Seleccionar {field}</Text>
          </TouchableOpacity>
          {images[field] && <Image source={{ uri: images[field] }} style={styles.imagePreview} />}
        </View>
      ))}

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
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
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
  imageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: GlobalStyles.blue,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: GlobalStyles.blue,
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
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default TextInputArraysForm;
