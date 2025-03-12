import { Link, useRouter } from "expo-router";
import { FC, useEffect, useState } from "react";
import { AUTHORITIES, AuthorityType } from "./Authorities";
import { useAuth } from "./useAuth";
import { StyleSheet, ActivityIndicator } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export function withAuth<T extends object>(
  Component: FC<T>,
  allowedRoles: AuthorityType[] = []
) {
  return function ProtectedScreen(props: T) {
    const router = useRouter();
    const { user, getUserFromStorage } = useAuth();
    const [storedUser, setStoredUser] = useState(user);
    const [loading, setLoading] = useState(true); // To handle the loading state
    const [mounted, setMounted] = useState(false); // Track if the component is mounted

    useEffect(() => {
      const fetchUser = async () => {
        if (!user) {
          const storedData = await getUserFromStorage();
          setStoredUser(storedData || { roles: [AUTHORITIES.ANONYMOUS] });
        } else {
          setStoredUser(user);
        }
        setLoading(false); // Set loading to false once the user is fetched
      };

      fetchUser();
    }, [user]); // Dependency on user state

    const roles = storedUser ? storedUser.roles : [AUTHORITIES.ANONYMOUS];

    useEffect(() => {
      // Mark the component as mounted
      setMounted(true);
    }, []);

    useEffect(() => {
      if (mounted && allowedRoles.length > 0 && !roles.some(role => allowedRoles.includes(role))) {
        router.replace("/"); 
      }
    }, [roles, allowedRoles, router, mounted]); // Ensure navigation happens only after mounting

    if (loading) {
      return <ActivityIndicator size="large" />; // Show loading indicator until the user is fetched
    }

    if (allowedRoles.length > 0 && !roles.some(role => allowedRoles.includes(role))) {
      return (
        <ThemedView style={styles.container}>
          <ThemedText type="title">This screen doesn't exist.</ThemedText>
          <Link href="/" style={styles.link}>
            <ThemedText>Go to home screen!</ThemedText>
          </Link>
        </ThemedView>
      );
    }

    return <Component {...props} />; // Render the protected component
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