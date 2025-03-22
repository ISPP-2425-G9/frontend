import TextInputArraysForm, { InputField } from '@/components/TextInputArraysForm';
import { ThemedText } from '@/components/ThemedText';
import { GlobalStyles } from '@/constants/Colors';
import { BACKEND_API } from '@/constants/Mysc';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Alert, Animated, Platform, Pressable, StyleSheet, View } from 'react-native';
import { AUTHORITIES } from '../_util/Authorities';
import { useAuth } from '../_util/useAuth';
import { withAuth } from '../_util/withAuth';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { login } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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
  }, [fadeAnim, slideAnim]);

  const handleSubmit = async (values: Record<string, string>) => {
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
      console.log(data);
      login(data.id, data.token, data.roles, data.username);
      navigation.navigate('home' as never);
    } catch (error: any) {
      if (Platform.OS === 'web') {
        window.alert(`Error: ${error.message}`);
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  const loginFields: InputField[] = [
    { name: 'identifier', placeholder: 'NIF, DNI o Email', keyboardType: 'default', description: 'Introduce tu NIF, DNI o Email' },
    { name: 'password', placeholder: '****', keyboardType: 'default', secureTextEntry: true, description: 'Introduce tu contraseña' },
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
        <ThemedText style={styles.subTitle}>Inicia sesión para continuar</ThemedText>
        <TextInputArraysForm
          title=""
          inputs={loginFields}
          onSubmit={(values) => handleSubmit(values as Record<string, string>)}
          buttonText="Iniciar sesión"
          style={styles.formStyle}
        />
        <ThemedText style={styles.registerText}>
          ¿Aún no tienes cuenta?{' '}
          <Pressable onPress={() => navigation.navigate('register/index' as never)}>
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
    fontFamily: GlobalStyles.fontBold,
    textAlign: "center",
    color: GlobalStyles.darkGrey,
    marginTop: 20,
    marginBottom: 5,
    marginHorizontal: 20,
  },
  subTitle: {
    color: GlobalStyles.darkGrey,
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  registerText: {
    color: GlobalStyles.darkGrey,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  registerLink: {
    color: GlobalStyles.blue,
    fontSize: 14,
    textAlign: 'center',
  },
  container: {
    backgroundColor: GlobalStyles.white,
    flex: 1,
    justifyContent: 'center',
    marginBottom: "20%",
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
  }
});


export default withAuth(LoginScreen, [AUTHORITIES.ANONYMOUS]);
