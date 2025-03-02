import { View, Text, Image, StyleSheet, Dimensions, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";

const { width } = Dimensions.get("window");


export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.container, width > 800 ? styles.rowLayout : styles.columnLayout]}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/images/caronte_azul.svg")} style={styles.logo} resizeMode="contain" />
          <Text style={styles.tagline}>Honrando memorias, facilitando despedidas.</Text>
        </View>
        
        <View style={styles.spacer} />
        
        <View style={styles.infoBox}>
          <Text style={styles.title}>¿Qué es CARONTE?</Text>
          <View style={styles.infoItem}>
            <MaterialIcons name="check-circle" size={24} color={GlobalStyles.blue} style={styles.icon} />
            <Text style={styles.description}>
              CARONTE permite a los usuarios gestionar el envío de mensajes finales y esquelas digitales
              a una lista de contactos seleccionada.
            </Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="check-circle" size={24} color={GlobalStyles.blue} style={styles.icon} />
            <Text style={styles.description}>
              <Text style={styles.bold}>No queremos que dejes palabras sin decir:</Text> garantizamos que
              los mensajes y esquelas sean enviados tras la confirmación del fallecimiento, asegurando la entrega en el momento
              adecuado.
            </Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="check-circle" size={24} color={GlobalStyles.blue} style={styles.icon} />
            <Text style={styles.description}>
              <Text style={styles.bold}>Cumplimos tu último deseo facilitando despedidas seguras y recuerdos eternos.</Text>
            </Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="check-circle" size={24} color={GlobalStyles.blue} style={styles.icon} />
            <Text style={styles.description}>
              Además, ofrecemos un espacio para que las empresas relacionadas con el sector funerario puedan patrocinar sus servicios.
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonSection}>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.buttonText}>Pulsa aquí, si quieres personalizar la esquela para un familiar o amigo que haya fallecido</Text>
            <CustomButton title="Personalizar esquela" onPress={() => navigation.navigate("obituaries/index" as never)} color="blue" />
          </View>
          <View style={styles.buttonWrapper}>
            <Text style={styles.buttonText}>Pulsa aquí, si quieres poder personalizar tus mensajes o tu esquela para enviársela a familiares, amigos o enemigos😏, una vez que hayas fallecido</Text>
            <CustomButton title="Suscribirse" onPress={() => navigation.navigate("subscribe/index" as never)} color="blue" />
          </View>
          <View style={styles.buttonWrapper}>
            <Text style={styles.buttonText}>Si quieres ver los servicios que ofrecen empresas del sector funerario, pulsa aquí</Text>
            <CustomButton title="Ver servicios" onPress={() => navigation.navigate("services/index" as never)} color="blue" />
          </View>
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
    paddingVertical: 110,
    marginTop: 50,
  },
  container: {
    width: "90%",
    maxWidth: 1500,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLayout: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  columnLayout: {
    flexDirection: "column",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  logo: {
    width: width > 800 ? width * 0.4 : width * 0.7,
    height: width > 800 ? 220 : 180,
    marginBottom: 15,
  },
  tagline: {
    fontSize: 28,
    fontFamily: GlobalStyles.fontBold,
    textAlign: "center",
    color: GlobalStyles.darkGrey,
    marginHorizontal: 20,
  },
  spacer: {
    width: width > 800 ? 100 : 0,
  },
  infoBox: {
    flex: 1.2,
    backgroundColor: GlobalStyles.lightGrey,
    padding: 40,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    maxWidth: width > 800 ? 900 : "90%",
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: GlobalStyles.fontBold,
    textAlign: "center",
    marginBottom: 12,
    color: GlobalStyles.darkGrey,
  },
  buttonSection: {
    marginTop: 100,
    width: "100%",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  buttonWrapper: {
    alignItems: "center",
    width: "30%",
    minWidth: 250,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: GlobalStyles.font,
    textAlign: "center",
    color: GlobalStyles.darkGrey,
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
    marginTop: 4,
  },
  description: {
    fontSize: 20,
    fontFamily: GlobalStyles.font,
    textAlign: "left",
    color: GlobalStyles.grey,
    maxWidth: "100%",
  },
  bold: {
    fontFamily: GlobalStyles.fontBold,
    color: GlobalStyles.darkGrey,
  },
});
