import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [roles, setRoles] = useState<any | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        setIsAuthenticated(!!token);
        if(!!token){
          const userRoles = await AsyncStorage.getItem("roles");
          setRoles(userRoles)
          const userEmail = await AsyncStorage.getItem("email");
          setEmail(userEmail)
        } else {
          localStorage.clear()
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
