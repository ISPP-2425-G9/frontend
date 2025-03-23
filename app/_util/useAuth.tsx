import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthorityType } from "./Authorities";

const USER_STORAGE_KEY = "user_data";

type UserType = {
  id: string;
  token: string;
  roles: AuthorityType[];
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

  const login = async ( id: string, token: string, roles: AuthorityType[]) => {
    const userData = { id, token, roles };
    setUser(userData);
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('userId', id);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
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

  return { user, getUserFromStorage, login, logout, updateUser, loading };
};
