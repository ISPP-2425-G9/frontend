import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [roles, setRoles] = useState<any | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData: string | null = await AsyncStorage.getItem("user_data");
        let user = null;
        let token = null;
        if(userData !== null) {
          user = JSON.parse(userData);
          token = user.token;
        }

        setIsAuthenticated(!!token);
        if(!!token){
          const userRoles = user.roles
          setRoles(userRoles)

          // TODO
          const userEmail = "email_test";
          setEmail(userEmail)
        } else {
          await AsyncStorage.clear();
          setRoles(null);
          setEmail(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error al verificar el token:", error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();

    const intervalId = setInterval(checkAuth, 500); // Revisa cada 0,5 segundos

    return () => clearInterval(intervalId);
  }, []); // Se ejecuta solo una vez al cargar el componente


  return { isAuthenticated, roles, email };
};

export default useAuth;
