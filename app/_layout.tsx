import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { GlobalStyles, Colors } from "@/constants/Colors";
import { useFonts, DMSans_500Medium, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import useAuth from "@/hooks/useAuth";


export default function TabLayout() {
  const { isAuthenticated, roles } = useAuth();
  let userRoles: string[] | null = null
  if(isAuthenticated){
    userRoles = roles
  }
  const colorScheme = useColorScheme();
  const theme = Colors["light"];

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
            "certificate/index": "newspaper-outline",
            "obituaries/index": "document",
            "messages/index": "chatbox",
            "contacts/index": "book-sharp",
            "services/index": "briefcase",
            "subscribe/index": "logo-bitcoin",
            "login/index": "log-in",
            "register/index": "person-add",
            "home": "home",
            "admin/listUsers": "people",
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
                marginBottom: -15,
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
          top: 10,
          paddingTop: 10,
          zIndex: 10,
        },
        tabBarLabelStyle: {
          fontFamily: GlobalStyles.font,
          fontSize: 12,
          fontWeight: "bold",
        },
        headerShown: false,
        safeAreaInsets: { top: 0 },
      })}
    >

      <Tabs.Screen name="home" options={{ title: "" }} />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="+not-found" options={{ href: null }} />
      <Tabs.Screen name="_util/Authorities" options={{ href: null }} />
      <Tabs.Screen name="_util/useAuth" options={{ href: null }} />
      <Tabs.Screen name="_util/utils" options={{ href: null }} />
      <Tabs.Screen name="_util/withAuth" options={{ href: null }} />
      
      


      {
        isAuthenticated ? [
          <Tabs.Screen name="certificate/index" options={{ title: "Cargar certificado" }} />,
          <Tabs.Screen name="login/index" options={{ href: null }} />,
          <Tabs.Screen name="register/index" options={{ href: null }} />,
        ] : [
          <Tabs.Screen name="certificate/index" options={{ title: "Cargar certificado" }} />,
          <Tabs.Screen name="login/index" options={{ title: "" }} />,
          <Tabs.Screen name="register/index" options={{ title: "" }} />,
          <Tabs.Screen name="obituaries/loadCertificate" options={{ href: null }} />,


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
  );
}
