import { View, Text, Image, StyleSheet, Dimensions, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import Logo from "@/components/Logo";
import useAuth from "@/hooks/useAuth";


const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { isAuthenticated, roles } = useAuth();
  let userRoles: string[] | null = null
  if(isAuthenticated){
    userRoles = roles
  }
  const navigation = useNavigation();
  const logoSize = width > 800 ? 225 : 150;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.container, width > 800 ? styles.rowLayout : styles.columnLayout]}>
        <View style={styles.logoContainer}>
          <Logo size={logoSize}/>
          <br/>
          <Text style={styles.tagline}>Honrando memorias,</Text>
          <Text style={styles.tagline}>facilitando despedidas</Text>
          <br/>
          <br/>
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

      { isAuthenticated && userRoles?.includes("CUSTOMER") &&
        <View style={styles.buttonSection}>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Text style={styles.buttonText}>Pulsa aquí, si quieres personalizar la esquela para un familiar o amigo que haya fallecido</Text>
              <CustomButton title="Personalizar esquela" onPress={() => navigation.navigate("obituaries/index" as never)} color="blue" />
            </View>
            <View style={styles.buttonWrapper}>
              <Text style={styles.buttonText}>Pulsa aquí, si quieres pagar el plan para personalizar mensajes para familiares o amigos una vez que haya fallecido o para promocionar tu empresa relacionada con el sector funerario.</Text>
              <CustomButton title="Suscribirse" onPress={() => navigation.navigate("subscribe/index" as never)} color="blue" />
            </View>
            <View style={styles.buttonWrapper}>
              <Text style={styles.buttonText}>Si quieres ver los servicios que ofrecen empresas del sector funerario, pulsa aquí</Text>
              <CustomButton title="Ver servicios" onPress={() => navigation.navigate("services/index" as never)} color="blue" />
            </View>
          </View>
        </View>
      }
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 120,
    paddingBottom: 300,
    marginTop: 30,
  },
  container: {
    width: "90%",
    maxWidth: 1500,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLayout: {
    flexDirection: width > 800 ? "row" : "column",
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
    marginBottom: 0,
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
    flex: 1,
    backgroundColor: GlobalStyles.lightGrey,
    padding: width > 800 ? 40 : 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    width: width > 800 ? 900 : "100%",
    alignSelf: "center",
    minHeight: "auto",
    marginBottom: 30,
  },
  title: {
    fontSize: width > 800 ? 28 : 22,
    fontFamily: GlobalStyles.fontBold,
    textAlign: "center",
    marginBottom: 12,
    color: GlobalStyles.darkGrey,
  },
  buttonSection: {
    marginTop: 40,
    width: "100%",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
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
    marginBottom: 5,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    flexWrap: "nowrap",
  },
  icon: {
    marginRight: 10,
    alignSelf: "flex-start",
  },
  description: {
    fontSize: width > 800 ? 20 : 16,
    fontFamily: GlobalStyles.font,
    textAlign: "left",
    color: GlobalStyles.grey,
    maxWidth: "100%",
    flex: 1,
  },
  bold: {
    fontFamily: GlobalStyles.fontBold,
    color: GlobalStyles.darkGrey,
  },
});
