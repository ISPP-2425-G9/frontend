import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth as useAuthApp } from "@/app/_util/useAuth"; // Asegúrate de que esto esté bien importado

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [roles, setRoles] = useState<string[] | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [expiredPlanDate, setExpiredPlanDate] = useState<Date | null>(null);
  const { logout, decodeJWT } = useAuthApp();

  // Refs to keep track of latest state
  const rolesRef = useRef(roles);
  const nameRef = useRef(name);
  const expiredPlanDateRef = useRef(expiredPlanDate);
  const isAuthenticatedRef = useRef(isAuthenticated);

  // Sync refs with state
  useEffect(() => { rolesRef.current = roles }, [roles]);
  useEffect(() => { nameRef.current = name }, [name]);
  useEffect(() => { expiredPlanDateRef.current = expiredPlanDate }, [expiredPlanDate]);
  useEffect(() => { isAuthenticatedRef.current = isAuthenticated }, [isAuthenticated]);

  function areSetsEqual(a: Set<any>, b: Set<any>) {
    return a.size === b.size && [...a].every(value => b.has(value));
  }

  function areDatesEqual(date1: Date | null, date2: Date | null) {
    return date1?.getTime() === date2?.getTime();
  }

  const syncAuthState = async () => {
    try {
      const userData: string | null = await AsyncStorage.getItem("user_data");
      let user = null;
      let token = null;

      if (userData) {
        user = JSON.parse(userData);
        token = user.token;
      }

      if (token) {
        const { exp } = decodeJWT(token);
        const expirationDate = new Date(exp * 1000);
        if (expirationDate < new Date()) {
          await logout();
        }

        const userRoles = user.roles;
        const userName = user.name;
        const userExpiredPlanDate = user.expiredPlanDate ? new Date(user.expiredPlanDate) : null;

        if (!areSetsEqual(new Set(rolesRef.current || []), new Set(userRoles))) {
          setRoles(userRoles);
        }

        if (nameRef.current !== userName) {
          setName(userName);
        }

        if (!areDatesEqual(expiredPlanDateRef.current, userExpiredPlanDate)) {
          setExpiredPlanDate(userExpiredPlanDate);
        }

        if (!isAuthenticatedRef.current) {
          setIsAuthenticated(true);
        }
      } else {
        await AsyncStorage.clear();
        setRoles(null);
        setName(null);
        setExpiredPlanDate(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error al verificar el token:", error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    syncAuthState(); // Run once on mount
    const intervalId = setInterval(syncAuthState, 750); 

    return () => clearInterval(intervalId);
  }, []);

  return { isAuthenticated, roles, name, expiredPlanDate };
};

export default useAuth;
