import CustomNavbar from "@/components/CustomNavbar";
import Footer from "@/components/Footer";
import { Colors } from "@/constants/Colors";
import { NotificationProvider } from "@/context/NotificationContext";
import useAuth from "@/hooks/useAuth";
import { DMSans_500Medium, DMSans_700Bold, useFonts } from "@expo-google-fonts/dm-sans";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View, useColorScheme } from "react-native";

export default function TabLayout() {
  const { isAuthenticated, roles } = useAuth();
  let userRoles: string[] | null = null;

  if (isAuthenticated) {
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

  return (
    <NotificationProvider>
      <View style={styles.container}>
        <CustomNavbar />
        <View style={styles.content}>
          <Tabs
            screenOptions={{
              tabBarStyle: { display: "none" },
              headerShown: false,
            }}
          >
            <Tabs.Screen name="home" options={{ title: "" }} />
            <Tabs.Screen name="index" options={{ href: null }} />
            <Tabs.Screen name="about/index" options={{ href: null }} />
            <Tabs.Screen name="contact/index" options={{ href: null }} />
            <Tabs.Screen name="+not-found" options={{ href: null }} />
            <Tabs.Screen name="certificate/index" options={{ title: "Cargar certificado" }} />


        {
          isAuthenticated ? [
            <Tabs.Screen name="login/index" options={{ href: null }} />,
            <Tabs.Screen name="register/index" options={{ href: null }} />,
          ] : [
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
              isAuthenticated && userRoles?.includes("COMPANY_FREE") ? [

              ] : [

              ]
            }

            {
              isAuthenticated && userRoles?.includes("COMPANY_PREMIUM") ? [

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
        <Footer />
      </View>
    </NotificationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  }
});