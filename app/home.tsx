import CustomButton from "@/components/CustomButton";
import LineBreak from "@/components/LineBreack";
import Logo from "@/components/Logo";
import { ThemedText } from "@/components/ThemedText";
import { GlobalStyles } from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React from 'react';
import { Animated, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

export default function HomeScreen() {
  const { isAuthenticated, roles } = useAuth();
  const { width } = useWindowDimensions();
  let userRoles: string[] | null = null;
  if (isAuthenticated) {
    userRoles = roles;
  }

  useFocusEffect(
    React.useCallback(() => {
      document.title = 'CARONTE';
    }, [])
  );

  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageCarousel />

      <View style={[styles.container, width > 800 ? styles.rowLayout : styles.columnLayout]}>
        <View style={styles.logoContainer}>
          <Logo size={250} />
          <LineBreak />
          <Text style={styles.tagline}>Honrando memorias,</Text>
          <Text style={styles.tagline}>facilitando despedidas</Text>
          <LineBreak />
          <LineBreak />
        </View>

        <View style={styles.spacer} />

        <View style={[styles.infoBox, { width: width > 800 ? 900 : "90%" }]}>
          <Text style={styles.title}>¿Qué hacemos?</Text>
          <View style={styles.infoItem}>
            <Text style={styles.description}>
              Somos una plataforma innovadora que te permite gestionar el envío de mensajes finales y esquelas digitales a tus contactos.
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.description}>
              <Text style={styles.bold}>No queremos que dejes palabras sin decir:</Text> garantizamos que
              los mensajes y esquelas sean enviados tras la confirmación del fallecimiento, asegurando la entrega en el momento
              adecuado.
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.description}>
              <Text style={styles.bold}>Cumplimos tu último deseo facilitando despedidas seguras y recuerdos eternos.</Text>
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.description}>
              Además, ofrecemos un espacio para que las empresas relacionadas con el sector funerario puedan patrocinar sus servicios.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        <ThemedText style={styles.featuresTitle}>
          ¿Por qué elegirnos?
        </ThemedText>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              heading={feature.heading}
              description={feature.description}
            />
          ))}
        </View>
      </View>

      {isAuthenticated && userRoles?.includes("CUSTOMER") && (
        <View style={styles.buttonSection}>
          <View style={styles.buttonContainer}>
            <View style={[styles.buttonWrapper, { width: width > 800 ? "30%" : "90%" }]}>
              <Text style={styles.buttonText}>Pulsa aquí, si quieres personalizar la esquela para un familiar o amigo que haya fallecido</Text>
              <CustomButton title="Personalizar esquela" onPress={() => { navigation.navigate("obituaries/index" as never) }} color="blue" />
            </View>
            <View style={[styles.buttonWrapper, { width: width > 800 ? "30%" : "90%" }]}>
              <Text style={styles.buttonText}>Pulsa aquí, si quieres pagar el plan para personalizar mensajes para familiares o amigos una vez que haya fallecido o para promocionar tu empresa relacionada con el sector funerario.</Text>
              <CustomButton title="Suscribirse" onPress={() => { navigation.navigate("subscribe/index" as never) }} color="blue" />
            </View>
            <View style={[styles.buttonWrapper, { width: width > 800 ? "30%" : "90%" }]}>
              <Text style={styles.buttonText}>Si quieres ver los servicios que ofrecen empresas del sector funerario, pulsa aquí</Text>
              <CustomButton title="Ver servicios" onPress={() => { navigation.navigate("services/index" as never) }} color="blue" />
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const ImageCarousel: React.FC = () => {
  const images = [
    "https://store-images.s-microsoft.com/image/apps.58752.13942869738016799.078aba97-2f28-440f-97b6-b852e1af307a.95fdf1a1-efd6-4938-8100-8abae91695d6?q=90&w=336&h=200",
    "https://hips.hearstapps.com/hmg-prod/images/red-dead-redemption-2-1539704658.jpg?crop=0.502xw:1.00xh;0.498xw,0&resize=1200:*",
    "https://i.scdn.co/image/ab67616d0000b273f337a21d945f44e802a1eb1d",
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const progress = React.useRef(new Animated.Value(0)).current;

  const startAnimation = React.useCallback(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        handleNext();
      }
    });
  }, [progress]);

  const handlePrev = () => {
    progress.stopAnimation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = React.useCallback(() => {
    progress.stopAnimation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length, progress]);

  React.useEffect(() => {
    startAnimation();
  }, [currentIndex, startAnimation]);

  const handleDotPress = (index: number) => {
    progress.stopAnimation();
    setCurrentIndex(index);
  };

  return (
    <View style={styles.carouselContainer}>
      <Image
        source={{ uri: images[currentIndex] }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
      <View style={styles.carouselButtons}>
        <TouchableOpacity onPress={handlePrev} style={styles.carouselButton}>
          <MaterialIcons name="chevron-left" size={32} color={GlobalStyles.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.carouselButton}>
          <MaterialIcons name="chevron-right" size={32} color={GlobalStyles.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleDotPress(index)}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const features: {
  icon: "security" | "check-circle" | "autorenew" | "brush";
  heading: string;
  description: string;
}[] = [
    {
      icon: "security",
      heading: "Seguridad",
      description:
        "Verificación de fallecimiento y cifrado seguro garantizan la integridad de tus mensajes.",
    },
    {
      icon: "check-circle",
      heading: "Confianza",
      description:
        "Plataforma transparente y accesible para que no te preocupes por nada.",
    },
    {
      icon: "autorenew",
      heading: "Automaticación",
      description:
        "Notificaciones automáticas a contactos de emergencia y envío de mensajes sin complicaciones.",
    },
    {
      icon: "brush",
      heading: "Personalización",
      description:
        "Personaliza mensajes y esquelas con fotos, videos y detalles del funeral.",
    },
  ];

const FeatureCard: React.FC<{
  icon: keyof typeof MaterialIcons.glyphMap;
  heading: string;
  description: string;
}> = ({ icon, heading, description }) => {
  const scale = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.featureCard, { transform: [{ scale }] }]}>
      <MaterialIcons name={icon} size={32} color={GlobalStyles.blue} />
      <ThemedText style={styles.featureCardHeading}>{heading}</ThemedText>
      <ThemedText style={styles.featureCardDescription}>{description}</ThemedText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxWidth: 1500,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  carouselContainer: {
    width: "100%",
    position: "relative",
    top: 0,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    margin: 0,
    padding: 0,
  },
  carouselImage: {
    width: Dimensions.get("window").width,
    height: 300,
  },
  carouselButtons: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  carouselButton: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 5,
    borderRadius: 20,
  },
  progressBarContainer: {
    position: "absolute",
    bottom: 10,
    height: 4,
    minWidth: 100,
    width: "10%",
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 2,
  },
  progressBar: {
    alignContent: "center",
    height: "100%",
    backgroundColor: GlobalStyles.blue,
    borderRadius: 2,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(0,0,0,0.3)",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: GlobalStyles.blue,
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
    width: 100,
  },
  infoBox: {
    flex: 1,
    backgroundColor: GlobalStyles.lightGrey,
    padding: 40,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    alignSelf: "center",
    minHeight: "auto",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
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
    fontSize: 20,
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
  featuresContainer: {
    alignSelf: "center",
    width: "100%",
    marginVertical: 20,
    paddingVertical: 20,
    backgroundColor: GlobalStyles.lightGrey,
  },
  featuresTitle: {
    fontSize: 24,
    fontFamily: GlobalStyles.fontBold,
    color: GlobalStyles.darkGrey,
    textAlign: "center",
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 20,
  },
  featureCard: {
    width: "24%",
    maxWidth: 250,
    aspectRatio: 1,
    minWidth: 250,
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyles.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureCardHeading: {
    fontSize: 16,
    fontFamily: GlobalStyles.fontBold,
    color: GlobalStyles.blue,
    textAlign: "center",
    marginTop: 8,
  },
  featureCardDescription: {
    fontSize: 12,
    fontFamily: GlobalStyles.font,
    color: GlobalStyles.grey,
    textAlign: "center",
    marginTop: 4,
  },
});