import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { GlobalStyles, Colors } from "@/constants/Colors";
import { useFonts, DMSans_500Medium, DMSans_700Bold } from "@expo-google-fonts/dm-sans";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];

  const [fontsLoaded] = useFonts({
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          const iconsDict: Record<string, keyof typeof Ionicons.glyphMap> = {
            "profile/index": "person",
            "obituaries/index": "document",
            "messages/index": "chatbox",
            "contacts/index": "people",
            "services/index": "briefcase",
            "subscribe/index": "card",
            "login/index": "log-in",
            "register/index": "person-add",
          };

          let iconName: keyof typeof Ionicons.glyphMap = iconsDict[route.name] ?? "home";

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
              style={{
                opacity: focused ? 1 : 0.6,
                transform: [{ scale: focused ? 1.1 : 1 }],
                transition: "opacity 0.2s, transform 0.2s",
              }}
            />
          );
        },
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderBottomWidth: 0,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
          height: 70,
          borderRadius: 20,
          position: "absolute",
          left: 15,
          right: 15,
          top: 10, // Lo mueve a la parte superior
          paddingTop: 10,
          zIndex: 10, // Asegura que quede encima del contenido
        },
        tabBarLabelStyle: {
          fontFamily: GlobalStyles.font,
          fontSize: 12,
          fontWeight: "bold",
        },
        headerShown: false, // Oculta el header de las pantallas individuales
        safeAreaInsets: { top: 0 }, // Evita que el navbar se superponga con la barra de estado
      })}
    >
      <Tabs.Screen name="obituaries/index" options={{ title: "Esquelas" }} />
      <Tabs.Screen name="messages/index" options={{ title: "Mensajes" }} />
      <Tabs.Screen name="contacts/index" options={{ title: "Contactos" }} />
      <Tabs.Screen name="services/index" options={{ title: "Servicios" }} />
      <Tabs.Screen name="subscribe/index" options={{ title: "Suscribirse" }} />
      <Tabs.Screen name="login/index" options={{ title: "Iniciar sesión" }} />
      <Tabs.Screen name="register/index" options={{ title: "Registrarse" }} />
      <Tabs.Screen 
        name="profile/index" 
        options={{ 
          title: "Perfil",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="person"
              size={size}
              color={color}
              style={{
                opacity: focused ? 1 : 0.6,
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            />
          )
        }} 
      />
    </Tabs>
  );
}
