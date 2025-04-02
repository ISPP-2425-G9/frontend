import TextInputArraysForm, { InputField } from '@/components/TextInputArraysForm';
import { ThemedText } from '@/components/ThemedText';
import { GlobalStyles } from '@/constants/Colors';
import { BACKEND_API } from '@/constants/Mysc';
import { useNotification } from '@/context/NotificationContext';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { AUTHORITIES } from '../_util/Authorities';
import { useAuth } from '../_util/useAuth';
import { withAuth } from '../_util/withAuth';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { showNotification } = useNotification();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useFocusEffect(
    React.useCallback(() => {
      document.title = 'Iniciar sesión';
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }, [fadeAnim, slideAnim])
  );

  const handleSubmit = async (values: Record<string, string>) => {

    if (!values.identifier || !values.password) {
      showNotification({
        message: "Por favor, rellena todos los campos",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch(BACKEND_API + `/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: values.identifier, password: values.password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas.');
      }
      const data = await response.json();
      void login(data.id, data.token, data.roles, data.username, data.name);
      navigation.navigate('home' as never);
      showNotification({
        message: "Has iniciado sesión correctamente",
        type: "success",
      });
    } catch (error: any) {
      showNotification({
        message: "Credenciales incorrectas",
        type: "error",
      });
    }
  };

  const loginFields: InputField[] = [
    {
      name: 'identifier',
      placeholder: 'NIF, DNI o email',
      keyboardType: 'default',
      description: 'Introduce tu NIF, DNI o email',
      maxLength: 50
    },
    {
      name: 'password',
      placeholder: '******',
      keyboardType: 'default',
      secureTextEntry: true,
      description: 'Introduce tu contraseña',
      maxLength: 36
    },
  ];


  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.formContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ThemedText style={styles.ThemedText}>Bienvenido</ThemedText>
        <TextInputArraysForm
          title=""
          inputs={loginFields}
          onSubmit={(values) => { handleSubmit(values as Record<string, string>) }}
          buttonText="Iniciar sesión"
          style={styles.formStyle}
        />
        {errorMessage !== "" && (
          <ThemedText style={styles.errorMessage}>{errorMessage}</ThemedText>
        )}
        <ThemedText style={styles.registerText}>
          ¿Aún no tienes cuenta?{' '}
          <Pressable onPress={() => { navigation.navigate('register/index' as never) }}>
            <ThemedText style={styles.registerLink}>Regístrate</ThemedText>
          </Pressable>
        </ThemedText>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  ThemedText: {
    fontSize: 28,
    fontFamily: GlobalStyles.font,
    textAlign: "center",
    color: GlobalStyles.darkGrey,
    marginTop: 20,
    marginHorizontal: 20,
  },
  registerText: {
    color: GlobalStyles.darkGrey,
    fontFamily: GlobalStyles.font,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  registerLink: {
    color: GlobalStyles.blue,
    fontSize: 14,
    textAlign: 'center',
  },
  container: {
    backgroundColor: GlobalStyles.white,
    flex: 1,
    marginTop: '5%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '90%',
    maxWidth: 550,
    alignSelf: 'center',
  },
  formStyle: {
    shadowColor: '#000',
    borderRadius: 10,
    width: '100%',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
});


export default withAuth(LoginScreen, [AUTHORITIES.ANONYMOUS]);
