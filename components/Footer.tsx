import { GlobalStyles } from "@/constants/Colors";
import { useNavigation } from '@react-navigation/native';
import React, { useState } from "react";
import { Dimensions, Modal, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import AnimatedIcon from "./AnimatedIcon";
import CustomButton from "./CustomButton";
import TermsAndConditions from "./TermsAndConditions";
import useResponsiveLayout from "@/hooks/useResponsiveLayout";

const socialLinks = [
  { name: "instagram", url: "https://instagram.com/caronte_es" },
  { name: "linkedin", url: "https://www.linkedin.com/in/caronte-app/" },
  { name: "x-twitter", url: "https://x.com/CaronteApp" },
  { name: "tiktok", url: "https://www.tiktok.com/@caronteapp" },
  { name: "github", url: "https://github.com/ISPP-2425-G9" },
  { name: "youtube", url: "https://www.youtube.com/@caronte_es" },
];

const Footer = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const { isMobile } = useResponsiveLayout();
    
    const styles = StyleSheet.create({
        footer: {
          backgroundColor: GlobalStyles.darkGrey,
          paddingVertical: isMobile ? 8 : 10,
          paddingHorizontal: isMobile ? 4 : 16,
          width: "100%",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      
        banner: {
          height: 50, 
          resizeMode: 'contain'
        },
        section: {
          flexDirection: "row",
        },
          
        centerSection: {
          flex: isMobile ? 0 : 2,
          flexDirection: isMobile ? "row" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? 1 : 20,
          marginVertical: isMobile ? 0 : 0,
          flexWrap: "wrap",
        },
        text: {
          fontSize: isMobile ? 10 : 13,
          color: "white",
          textAlign: "center",
        },
        textLink: {
          color: "#00aced",
          fontSize: isMobile ? 10 : 12,
          textAlign: "center",
          textDecorationLine: "underline",
          marginVertical: isMobile ? 0 : 0,
          marginHorizontal: isMobile ? 4 : 0,
        },
        icon: {
          marginHorizontal: isMobile ? 3 : 10,
        },
        modalContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        modalContent: {
          width: width < 375 ? "95%" : "90%",
          maxHeight: "60%",
          backgroundColor: GlobalStyles.white,
          padding: 20,
          borderRadius: 10,
        },
        modalTitle: {
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 10,
        },
        modalText: {
          fontSize: 16,
          color: GlobalStyles.darkGrey,
          marginBottom: 20,
        },
        modalButton: {
          marginTop: 20,
          alignSelf: "center",
        },
        logoContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 0,
          },
          tagline: {
            fontSize: 15,
            fontFamily: GlobalStyles.fontBold,
            textAlign: "center",
            color: GlobalStyles.lightGrey,
            marginTop: 4,
          },
          leftSection: {
            flex: isMobile ? 0 : 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: isMobile ? 0 : 0,
          },
          rightSection: {
            flex: isMobile ? 0 : 1,
            alignItems: "center",
            justifyContent: "center",
            marginTop: isMobile ? 1 : 0,
          },
      });

  return (
    <View style={styles.footer}>
      {/* Sección izquierda: Redes sociales */}
      <View style={styles.leftSection}>
        {socialLinks.map((link, index) => (
          <AnimatedIcon 
            key={index} 
            name={link.name} 
            url={link.url} 
            size={isMobile ? 16 : 20}
          />
        ))}
      </View>

      {/* Sección central: Texto + enlaces */}
      <View style={styles.centerSection}>
        <Text style={styles.textLink} onPress={() => setModalVisible(true)}>Términos y condiciones</Text>
        <Text style={styles.textLink} onPress={() => navigation.navigate("contact/index" as never)}>Contáctanos</Text>
      </View>

      {/* Sección derecha: Logo u otra info */}
      <View style={styles.rightSection}>
        <Text style={styles.text}>&copy; 2025 CARONTE. Todos los derechos reservados.</Text>
      </View>

      {/* Modal de Términos */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Términos y condiciones de uso</Text>
              <TermsAndConditions />
            </ScrollView>
            <CustomButton
              title="Cerrar"
              onPress={() => setModalVisible(false)}
              color="blue"
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Footer;