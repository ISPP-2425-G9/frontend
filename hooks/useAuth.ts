import { useAuth as useAuthApp} from "@/app/_util/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";


const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [roles, setRoles] = useState<string[] | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [experedPlanDate, setExperedPlanDate] = useState<Date | null>(null);
  const { logout, decodeJWT } = useAuthApp();

  useEffect(() => {
    const useAuth = async () => {
      try {
        const userData: string | null = await AsyncStorage.getItem("user_data");
        let user = null;
        let token = null;
        if(userData !== null) {
          user = JSON.parse(userData);
          token = user.token;
        }

        if(!!token){
          const { exp } = decodeJWT(token);
          const expirationDate = new Date(exp * 1000)
          if(expirationDate < new Date()) {
            await logout();
          }
          const userRoles = user.roles
          const userName = user.name;
          const userExperedPlanDate = new Date(user.experedPlanDate);
          setRoles(userRoles)
          setName(userName)
          setExperedPlanDate(userExperedPlanDate);
          setIsAuthenticated(true);
        } else {
          await AsyncStorage.clear();
          setRoles(null);
          setName(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error al verificar el token:", error);
        setIsAuthenticated(false);
      }
    };
    useAuth();

    const intervalId = setInterval(useAuth, 500);

    return () => {clearInterval(intervalId)};
  }, []); 


  return { isAuthenticated, roles, name, experedPlanDate };
};

export default useAuth;
