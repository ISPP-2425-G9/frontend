import { Colors, GlobalStyles } from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import { DMSans_500Medium, DMSans_700Bold, useFonts } from "@expo-google-fonts/dm-sans";
import { Tabs, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

function ProfileDropdown({ userName }: { userName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleProfile = () => {
    setOpen(false);
    //router.push("profile/index");
  };

  const handleLogout = () => {
    setOpen(false);
    // Aquí llamar a tu función de logout
    // Por ejemplo: logout();
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Text style={styles.profileLabel}>{userName}</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={handleProfile}>
            <Text style={styles.dropdownItem}>Mi perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.dropdownItem}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    alignItems: "center",
    // Para que el dropdown se muestre sobre el tabBar
    zIndex: 100,
  },
  profileLabel: {
    fontFamily: GlobalStyles.font,
    fontSize: 16,
    fontWeight: "bold",
    color: GlobalStyles.blue,
    textAlign: "center",
  },
  dropdownMenu: {
    position: "absolute",
    top: 25,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 100,
  },
  dropdownItem: {
    paddingVertical: 5,
    color: GlobalStyles.blue,
    textAlign: "center",
  },
});

export default function TabLayout() {
  const { isAuthenticated, roles } = useAuth();
  let userRoles: string[] | null = null
  if(isAuthenticated){
    userRoles = roles;
  }
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];

  const [fontsLoaded] = useFonts({
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const labelsDict: Record<string, string> = {
    "home": "Inicio",
    "login/index": "Iniciar sesión",
    "register/index": "Registrarse",
    "profile/index": "Perfil",
    "obituaries/index": "Esquelas",
    "messages/index": "Mensajes",
    "contacts/index": "Contactos",
    "services/index": "Servicios",
    "subscribe/index": "Planes",
    "admin/listUsers": "Usuarios",
    "admin/editUser": "Editar usuario",
  };

  return (
    <View style={{ flex: 1 }}>
    <Tabs
      screenOptions={({ route }) => ({
        tabBarBackground: () => (
          <Image
            source={require("@/assets/images/icon_caronte_azul.svg")}
            style={{
              top: 10,
              width: 50,
              height: 50,
              position: "absolute",
              alignContent: "center",
              resizeMode: "cover",
            }}
          />
        ), 
        tabBarLabel: ({ focused }) =>
          route.name === "profile/index" && isAuthenticated ? (
            <ProfileDropdown userName={"Usuario"} />
          ) : (
            <Text style={{
              fontFamily: GlobalStyles.font,
              justifyContent: "center",
              fontSize: 16,
              fontWeight: "bold",
              color: GlobalStyles.blue,
              borderBottomWidth: focused ? 3 : 0,
              borderBottomColor: GlobalStyles.blue,
              borderRadius: 2,
              textAlign: "center",
              marginTop: -10,
              overflow: "visible",
            }}>
              {labelsDict[route.name]}
            </Text>
          ),
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: "white",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 70,
          position: "absolute",
          top: 0,
        },
        headerShown: false,
        safeAreaInsets: { top: 0 },
      })}
    >

      <Tabs.Screen name="home" options={{ title: "" }} />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="+not-found" options={{ href: null }} />

      {
        isAuthenticated ? [
          <Tabs.Screen name="login/index" options={{ href: null }} />,
          <Tabs.Screen name="register/index" options={{ href: null }} />,
        ] : [
          <Tabs.Screen name="login/index" options={{ title: "" }} />,
          <Tabs.Screen name="register/index" options={{ title: "" }} />,
        ]
      }

      { 
        isAuthenticated && userRoles?.includes("ADMIN") ? [
          <Tabs.Screen name="admin/listUsers" options={{ title: "" }} />,
          <Tabs.Screen name="admin/editUser" options={{ href: null }} />,
        ] : [
          <Tabs.Screen name="admin/listUsers" options={{ href: null }} />,
          <Tabs.Screen name="admin/editUser" options={{ href: null }} />,
        ]
      }

      { 
        isAuthenticated && userRoles?.includes("CUSTOMER") ? [
          <Tabs.Screen name="obituaries/index" options={{ title: "" }} />,
          <Tabs.Screen name="obituaries/createObituary" options={{ href: null }} />,
          <Tabs.Screen name="obituaries/listMyObituaries" options={{ href: null }} />,
          <Tabs.Screen name="obituaries/selectContacts" options={{ href: null }} />,
          <Tabs.Screen name="obituaries/loadCertificate" options={{ href: null }} />,
        ] : [
          <Tabs.Screen name="obituaries/index" options={{ href: null }} />,
          <Tabs.Screen name="obituaries/createObituary" options={{ href: null }} />,
          <Tabs.Screen name="obituaries/listMyObituaries" options={{ href: null }} />,
          <Tabs.Screen name="obituaries/selectContacts" options={{ href: null }} />,
          <Tabs.Screen name="obituaries/loadCertificate" options={{ href: null }} />,
        ]
      }

      { 
        isAuthenticated && userRoles?.includes("CUSTOMER_FREE") ? [
          
        ] : [
          
        ]
      }

      { 
        isAuthenticated && userRoles?.includes("CUSTOMER_PREMIUM") ? [
          <Tabs.Screen name="messages/index" options={{ title: "" }} />,
          <Tabs.Screen name="contacts/index" options={{ title: "" }} />,
        ] : [
          <Tabs.Screen name="messages/index" options={{ href: null }} />,
          <Tabs.Screen name="contacts/index" options={{ href: null }} />,
        ]
      }

      { 
        isAuthenticated && userRoles?.includes("COMPANY") ? [
          
        ] : [
          
        ]
      }

      { 
        isAuthenticated && userRoles?.includes("COMPANY_FREE")  ? [

        ] : [

        ]
      }

      { 
        isAuthenticated && userRoles?.includes("COMPANY_PREMIUM")  ? [

        ] : [

        ]
      }
      
      { 
        isAuthenticated && (userRoles?.includes("CUSTOMER") || userRoles?.includes("COMPANY")) ? [
          <Tabs.Screen name="services/index" options={{ title: "" }} />,
          <Tabs.Screen name="subscribe/index" options={{ title: "" }} />,
          <Tabs.Screen name="profile/index" options={{ title: "" }} />,
        ] : [
          <Tabs.Screen name="services/index" options={{ href: null }} />,
          <Tabs.Screen name="subscribe/index" options={{ href: null }} />,
          <Tabs.Screen name="profile/index" options={{ href: null }} />,
        ]
      }
      
    </Tabs>
    </View>

  );
}
