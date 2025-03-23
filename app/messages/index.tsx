import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';
import CustomTextInput from '@/components/CustomTextInput';
import { useState } from 'react';
import CustomButton from '@/components/CustomButton';

function MessageCreation() {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSaveMessage = () => {
    console.log('Mensaje guardado:', formData);
  };

  const handleSelectContacts = () => {
    console.log('Seleccionar contactos');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <CustomTextInput
          style={{ width: '100%' }}
          placeholder="Título del mensaje"
          maxLength={100}
          value={formData.title}
          onChangeText={(text) => handleChange('title', text)}
        />

        <CustomTextInput
          style={styles.textArea}
          placeholder="Texto personalizado"
          maxLength={20000}
          multiline={true}
          value={formData.text}
          onChangeText={(text) => handleChange('text', text)}
        />


        <CustomButton
            color="blue"
            style={styles.selecContactButton}
            title="Seleccionar archivos"
            onPress={handleSelectContacts}
          />
        <View style={styles.buttonContainer}>
          <CustomButton
            color="blue"
            style={styles.button}
            title="Guardar mensaje"
            onPress={handleSaveMessage}
          />

          <CustomButton
            color="blue"
            style={styles.button}
            title="Seleccionar contactos"
            onPress={handleSelectContacts}
          />
        </View>
              <View style={styles.divider} />
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 105,
    backgroundColor: '#fff',
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 50,
  },
  formContainer: {
    width: '45%',
    justifyContent: 'flex-start',
  },
  textArea: {
    width: '100%',
    height: 400,
    textAlignVertical: 'top',
    backgroundColor: '#e5e5e5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    gap: 10,
    marginTop: 30,
    justifyContent: 'center'
  },
  textPreview: {
    backgroundColor: '#e5e5e5',
    borderRadius: 12,
    padding: 12,
    width: '80%',
    marginBottom: 20,
  },
  previewButton: {
    backgroundColor: '#4DB5F4',
    padding: 12,
    borderRadius: 20,
    width: '60%',
    alignItems: 'center',
  },
  selecContactButton: {
    width: '50%',
    marginTop: 12,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  button: {
    width: '30%', 
    alignSelf: 'center',
    height: 50,
  },
});

export default withAuth(MessageCreation, [AUTHORITIES.CUSTOMER]);
