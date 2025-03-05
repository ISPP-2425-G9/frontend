import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }, []);
  return { isAuthenticated };
};

export default useAuth;
