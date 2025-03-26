import { Linking, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import { GlobalStyles } from "@/constants/Colors";
import React, { useState } from "react";
import TermsAndConditions from "./TermsAndConditions";
import { useNavigation } from '@react-navigation/native';
import CustomButton from "./CustomButton";

const socialLinks = [
  { name: "instagram", url: "https://instagram.com/caronte_es" },
  { name: "linkedin", url: "https://www.linkedin.com/in/caronte-app/" },
  { name: "x-twitter", url: "https://x.com/CaronteApp" },
  { name: "tiktok", url: "https://www.tiktok.com/@caronteapp" },
  { name: "github", url: "https://github.com/ISPP-2425-G9" }
];

const Footer = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const navigation = useNavigation();
    
    const deviceWidth = Dimensions.get("window").width;
    const styles = StyleSheet.create({
        footer: {
          backgroundColor: GlobalStyles.darkGrey,
          padding: 4,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        banner: {
          height: 50, 
          resizeMode: 'contain'
        },
        section: {
          flexDirection: "row",
        },
        centerSection: {
          alignItems: "center",
          flex: 1,
        },
        text: {
          fontSize: 12,
          color: "white",
          textAlign: "center",
        },
        textLink: {
          color: "#00aced",
          fontSize: 11,
          textAlign: "center",
          textDecorationLine: "underline",
        },
        icon: {
          marginHorizontal: 10,
        },
        modalContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        modalContent: {
          width: deviceWidth < 375 ? "95%" : "90%",
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
      });

  return (
    <View style={styles.footer}>

      <View style={styles.logoContainer}>
          <Image source={require("../assets/images/banner.png")} style={styles.banner} />
      </View>

      <View style={styles.section}>
        {socialLinks.map((link, index) => (
          <TouchableOpacity key={index} onPress={() => Linking.openURL(link.url)}>
            <Icon name={link.name} size={24} color="white" style={styles.icon} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.centerSection}>
        <Text style={styles.text}>&copy; 2025 CARONTE. Todos los derechos reservados.</Text>
        <Text style={styles.textLink} onPress={() => {setModalVisible(true)}}>Términos y condiciones de uso</Text>
        <Text style={styles.textLink} onPress={()=> { navigation.navigate("about/index" as never);}}>Sobre nosotros</Text>
        <Text style={styles.textLink} onPress={()=> { navigation.navigate("contact/index" as never);}}>Contáctanos</Text>
        {/* <Text style={styles.textLink} onPress={() => Linking.openURL('/privacy')}>Política de privacidad</Text> */}
      </View>

      <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => {setModalVisible(false)}}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <ScrollView>
                      <Text style={styles.modalTitle}>Términos y condiciones de uso</Text>
                      <TermsAndConditions />
                    </ScrollView>
                    <CustomButton
                      title="Cerrar"
                      onPress={() => {setModalVisible(false)}}
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