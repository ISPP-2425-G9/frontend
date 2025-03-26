import { useNavigation } from '@react-navigation/native';
import { useFocusEffect, useRouter } from "expo-router";
import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from "react-native";
import { AUTHORITIES, AuthorityType } from "./Authorities";
import { useAuth } from "./useAuth";

export function withAuth<T extends object>(
  Component: FC<T>,
  allowedRoles: AuthorityType[] = []
) {
  return function ProtectedScreen(props: T) {
    const navigation = useNavigation();
    const { user, getUserFromStorage } = useAuth();
    const [storedUser, setStoredUser] = useState(user);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      const fetchUser = async () => {
        if (!user) {
          const storedData = await getUserFromStorage();
          setStoredUser(storedData || { roles: [AUTHORITIES.ANONYMOUS] });
        } else {
          setStoredUser(user);
        }
        setLoading(false);
      };

      fetchUser();
    }, [user]);

    const roles = storedUser ? storedUser.roles : [AUTHORITIES.ANONYMOUS];

    useEffect(() => {
      setMounted(true);
    }, []);

    useFocusEffect(
      React.useCallback(() => {
        if (mounted && allowedRoles.length > 0 && !roles.some(role => allowedRoles.includes(role))) {
          navigation.navigate('home' as never);
        }
      }, [mounted, allowedRoles, roles, navigation])
    );

    if (loading) {
      return <ActivityIndicator size="large" />;
    }

    if (allowedRoles.length > 0 && !roles.some(role => allowedRoles.includes(role))) {
      return null;
    }

    return <Component {...props} />;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});