import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { GlobalStyles } from "@/constants/Colors";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require("../assets/images/caronte_azul.svg")} style={styles.logo} resizeMode="contain" />
          <Text style={styles.tagline}>Honrando memorias, facilitando despedidas.</Text>
        </View>
        
        <View style={styles.infoBox}>
          <Text style={styles.title}>¿Qué es CARONTE?</Text>
          <Text style={styles.description}>
            CARONTE permite a los usuarios gestionar el envío de mensajes finales y esquelas digitales
            a una lista de contactos seleccionada.
          </Text>
          <Text style={styles.description}>
            <Text style={styles.bold}>No queremos que dejes palabras sin decir:</Text> garantizamos que
            los mensajes y esquelas sean enviados tras la confirmación del fallecimiento, asegurando la entrega en el momento
            adecuado.
          </Text>
          <Text style={styles.description}>
            <Text style={styles.bold}>Cumplimos tu último deseo facilitando despedidas seguras y recuerdos eternos.</Text>
          </Text>
          <Text style={styles.description}>
            Además, ofrecemos un espacio para que las empresas relacionadas con el sector funerario puedan patrocinar sus servicios.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 120,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GlobalStyles.white,
    padding: 20,
    width: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 80,
    width: "100%",
  },
  logo: {
    width: width * 0.6,
    height: height * 0.2,
    marginBottom: 30,
  },
  tagline: {
    fontSize: 30,
    fontFamily: GlobalStyles.fontBold,
    textAlign: "center",
    color: GlobalStyles.darkGrey,
    marginHorizontal: 20,
  },
  infoBox: {
    backgroundColor: GlobalStyles.lightGrey,
    padding: 30,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    width: "90%",
    maxWidth: 600,
  },
  title: {
    fontSize: 26,
    fontFamily: GlobalStyles.fontBold,
    textAlign: "center",
    marginBottom: 12,
    color: GlobalStyles.darkGrey,
  },
  description: {
    fontSize: 18,
    fontFamily: GlobalStyles.font,
    textAlign: "center",
    color: GlobalStyles.grey,
    marginBottom: 10,
  },
  bold: {
    fontFamily: GlobalStyles.fontBold,
    color: GlobalStyles.darkGrey,
  },
  button: {
    marginTop: 25,
    backgroundColor: GlobalStyles.blue,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  buttonText: {
    color: GlobalStyles.white,
    fontSize: 18,
    fontFamily: GlobalStyles.fontBold,
  },
});