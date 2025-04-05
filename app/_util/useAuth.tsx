import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { AuthorityType } from "./Authorities";

const USER_STORAGE_KEY = "user_data";

type UserType = {
  id: string;
  token: string;
  roles: AuthorityType[];
  experedPlanDate: Date;
};

export const useAuth = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (isMounted && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error cargando usuario:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (
    id: string,
    token: string,
    roles: AuthorityType[],
    username: string,
    name: string,
    experedPlanDate: Date
  ) => {
    const userData = { id, token, roles, username, name, experedPlanDate };

    try {
      setUser(userData);

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userId', id);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.clear();
  };

  const updateUser = async (newUserData: Partial<UserType>) => {
    if (!user) return;
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    await AsyncStorage.setItem('authToken', user.token);
    await AsyncStorage.setItem('userId', user.id);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const getUserFromStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      return null;
    }
  };

  const decodeJWT = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar la parte del payload
      return payload;
    } catch (error) {
      console.error("Error al decodificar el JWT:", error);
      return null;
    }
  };

  return { getUserFromStorage, login, logout, updateUser, loading, decodeJWT };
};
