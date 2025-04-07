import LineBreak from "@/components/LineBreak";
import Logo from "@/components/Logo";
import { ThemedText } from "@/components/ThemedText";
import { GlobalStyles } from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions } from "react-native";

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

      <View style={[styles.container, width > 800 ? styles.rowLayout : styles.columnLayout]}>
        <View style={styles.logoContainer}>
          <Logo size={250} />
          <LineBreak />
          <ThemedText style={styles.tagline}>Honrando memorias,</ThemedText>
          <ThemedText style={styles.tagline}>facilitando despedidas</ThemedText>
          <LineBreak />
          <LineBreak />
        </View>

        <View style={styles.spacer} />

        <View style={[styles.infoBox, { width: width > 800 ? 900 : "90%" }]}>
          <ThemedText style={styles.title}>¿Qué es CARONTE?</ThemedText>
          <ThemedText style={styles.description}>
            Somos una <ThemedText style={styles.bold}>plataforma innovadora</ThemedText> que te permite gestionar el envío de mensajes finales y esquelas digitales a tus contactos.
          </ThemedText>
          <ThemedText style={styles.description}>
            <ThemedText style={styles.bold}>No queremos que dejes palabras sin decir. </ThemedText>Tus mensajes se envían tras la confirmación del fallecimiento, garantizando la entrega en el momento adecuado.
          </ThemedText>
          <ThemedText style={styles.description}>
            Cumplimos tu último deseo facilitando despedidas seguras y recuerdos eternos.
          </ThemedText>
          <ThemedText style={styles.description}>
            Además, ofrecemos un espacio para que las empresas relacionadas con el sector funerario puedan patrocinar sus servicios.
          </ThemedText>
        </View>
      </View>

      <ImageCarousel />

      <GallerySection />

      <AboutUs />

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

    </ScrollView>
  );
}

const ImageCarousel: React.FC = () => {
  const images = [
    "https://i.ytimg.com/vi/xRBR3agfWQA/maxresdefault.jpg",
    "https://i.ytimg.com/vi/Q2qeMli8oq8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAkq3ofCqRd7ZFinG2x5DJTB0tTZA",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWIQ3FJppj1dL2JSBp2O7d2ZealsPYiobdw&s",
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

const videoIds = [
  "WHBSjduVhoo",
  "A_VFqpbJ5Yw",
  "KkkRXSZX0lg?si=caXEZSRZN4IG8Gjk",
];

const GallerySection: React.FC = ({ }) => {
  return (
    <>
      <View style={{ height: 40 }} />
      <ThemedText style={styles.featuresTitle}>Galería</ThemedText>
      <View style={styles.galleryContainer}>
        <View style={styles.galleryGrid}>
          {videoIds.map((videoId, index) => (
            <YoutubeVideo key={index} videoId={videoId} />
          ))}
        </View>
      </View>
    </>
  );
};

const YoutubeVideo: React.FC<{ videoId: string }> = ({ videoId }) => {
  const [playerReady, setPlayerReady] = useState(false);

  return (
    <View style={styles.videoContainer}>
      <YoutubeIframe
        videoId={videoId}
        height={200}
        onReady={() => setPlayerReady(true)}
        webViewProps={{
          renderToHardwareTextureAndroid: true,
          androidLayerType: 'hardware',
          injectedJavaScript: `
              // Disable YouTube logging
              try {
                XMLHttpRequest.prototype.open = function() {
                  if (!arguments[1].includes('/log_event')) {
                    return XMLHttpRequest.prototype.open.apply(this, arguments);
                  }
                };
              } catch(e) {}
              true;
            `,
          onMessage: () => setPlayerReady(true)
        }}
      />
    </View>
  );
};


import YoutubeIframe from 'react-native-youtube-iframe';

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

const AboutUs: React.FC = () => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.section}>
      <Animated.Text style={[styles.featuresTitle, { opacity: fadeAnim }]}>Sobre nosotros</Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>Conoce al equipo detrás de CARONTE</Animated.Text>

      <View style={styles.introTextContainer}>
        <Animated.Text style={[styles.introText, { opacity: fadeAnim }]}>
          <ThemedText style={styles.bold}>CARONTE</ThemedText> nace como una solución digital innovadora en la <ThemedText style={styles.bold}>Universidad de Sevilla</ThemedText>, dentro de la asignatura
          de Ingeniería del Software y Práctica Profesional. Nuestra misión es revolucionar la manera en la que las personas pueden <ThemedText style={styles.bold}>dejar su legado digital</ThemedText>,
          asegurando que sus últimas palabras y mensajes sean entregados en el momento preciso.
        </Animated.Text>
        <Animated.Text style={[styles.introText, { opacity: fadeAnim }]}>
          Detrás de <ThemedText style={styles.bold}>CARONTE</ThemedText> hay un equipo de <ThemedText style={styles.bold}>15 desarrolladores apasionados</ThemedText> que han trabajado para hacer de esta idea una realidad.
          Nuestro equipo está especializado en desarrollo full-stack, asegurando que la experiencia del usuario sea fluida y eficiente.
        </Animated.Text>
      </View>

      <View style={styles.teamGrid}>
        {teamMembers.map((member, index) => (
          <View key={index} style={styles.teamMember}>
            <Image source={member.image} style={styles.memberImage} />
            <ThemedText style={styles.memberName}>{member.name}</ThemedText>
            <ThemedText style={styles.memberRole}>{member.role}</ThemedText>
            <ThemedText style={styles.hobbies}>{member.hobbies}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
};

const teamMembers = [
  { name: "Hugo Angulo Borrego", role: "Desarrollador Frontend", image: require('@/assets/images/team/hugo.png'), hobbies: "Amante de la tecnología y los gatos." },
  { name: "Álvaro Chico Castellano", role: "Desarrollador Full-Stack y Especialista en Marketing", image: require('@/assets/images/team/alvaro.png'), hobbies: "Apasionado de la ingeniería software e interesado en la inteligencia artificial." },
  { name: "Rafael Duque Colete", role: "Desarrollador Frontend", image: require('@/assets/images/team/rafael.png'), hobbies: "Amante del fútbol, el deporte y las buenas series." },
  { name: "Daniel Galván Cancio", role: "Coordinador de Marketing y Desarrollador Frontend", image: require('@/assets/images/team/daniel.png'), hobbies: "Apasionado de nuevos retos tecnológicos." },
  { name: "Juan García Carballo", role: "Coordinador de Backend y Desarrollador Full-Stack", image: require('@/assets/images/team/juan.png'), hobbies: "Amante de los libros y el cine." },
  { name: "Ángel García Escudero", role: "DevRel y Desarrollador Backend", image: require('@/assets/images/team/angel.png'), hobbies: "Apasionado por la aviación, el deporte y mundo del motorsport." },
  { name: "Andrés Francisco García Rivero", role: "Desarrollador Frontend", image: require('@/assets/images/team/andres.png'), hobbies: "Apasionado por el motorsport y la electrónica." },
  { name: "David Guillén Fernández", role: "Desarrollador Backend y Especialista en Marketing", image: require('@/assets/images/team/david.png'), hobbies: "Apasionado del deporte y la programación." },
  { name: "Lucas Manuel Herencia Solís", role: "Desarrollador Backend", image: require('@/assets/images/team/lucas.png'), hobbies: "Amante de Java." },
  { name: "Jaime Linares Barrera", role: "Coordinador de Frontend y Desarrollador Frontend", image: require('@/assets/images/team/jaime.png'), hobbies: "Fanático del fútbol y apasionado de la inteligencia artificial." },
  { name: "Jorge Muñoz Rodríguez", role: "Coordinador de Despliegue y Desarrollador DevOps", image: require('@/assets/images/team/jorge.png'), hobbies: "Apasionado por la tecnología y los coches." },
  { name: "Alejandro Pérez Santiago", role: "Desarrollador DevOps", image: require('@/assets/images/team/alejandro.png'), hobbies: "Apasionado por la tecnología, siempre enfocado en la mejora continua y en afrontar nuevos retos." },
  { name: "Javier Rodríguez Reina", role: "Desarrollador Backend", image: require('@/assets/images/team/javier.png'), hobbies: "Le gusta la literatura y los juegos de estrategia." },
  { name: "Isaac Solís Padilla", role: "Desarrollador Backend", image: require('@/assets/images/team/isaac.png'), hobbies: "Amante de los videojuegos." },
  { name: "Karim Youssafi Benichikh", role: "Desarrollador Frontend y Especialista en Marketing", image: require('@/assets/images/team/karim.png'), hobbies: "Amante de la tecnología y la inteligencia artificial." },
];

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
    marginTop: 40,
  },
  carouselContainer: {
    width: "100%",
    backgroundColor: GlobalStyles.lightGrey,
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
    height: 400,
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
    borderRadius: 25,
    alignSelf: "center",
    minHeight: "auto",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: GlobalStyles.fontBold,
    textAlign: "center",
    marginBottom: 12,
    color: GlobalStyles.darkGrey,
  },
  buttonSection: {
    backgroundColor: GlobalStyles.lightGrey,
    padding: 20,
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
    marginVertical: 5,
    fontSize: 16,
    fontFamily: GlobalStyles.font,
    textAlign: "left",
    color: GlobalStyles.grey,
    maxWidth: "100%",
    flex: 1,
  },
  bold: {
    fontSize: 16,
    fontWeight: "600",
    color: GlobalStyles.darkGrey,
  },
  featuresContainer: {
    alignSelf: "center",
    width: "100%",
    paddingVertical: 30,
    backgroundColor: GlobalStyles.lightGrey,
  },
  featuresTitle: {
    fontSize: 24,
    fontFamily: GlobalStyles.fontBold,
    color: GlobalStyles.darkGrey,
    textAlign: "center",
    marginBottom: 20,
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
    backgroundColor: "#fff",
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
  section: {
    width: "90%",
    marginBottom: 30,
    borderRadius: 10,
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: GlobalStyles.darkGrey,
    marginBottom: 20,
  },
  introTextContainer: {
    marginBottom: 20,
  },
  introText: {
    alignSelf: 'center',
    fontSize: 16,
    textAlign: 'justify',
    color: GlobalStyles.darkGrey,
    marginBottom: 15,
    lineHeight: 24,
    maxWidth: 1200,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  teamMember: {
    aspectRatio: 1.5,
    minHeight: 350,
    width: "90%",
    maxWidth: 400,
    padding: 20,
    margin: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3,
    alignContent: 'center',
    justifyContent: 'center',
  },
  memberImage: {
    width: 170,
    height: 170,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: GlobalStyles.lightGrey,
  },
  memberName: {
    fontSize: 16,
    marginTop: 15,
    fontWeight: 'bold',
    color: GlobalStyles.darkGrey,
  },
  memberRole: {
    fontSize: 14,
    color: GlobalStyles.grey,
    marginVertical: 5,
  },
  hobbies: {
    fontSize: 12,
    fontStyle: 'italic',
    color: GlobalStyles.grey,
    textAlign: 'center',
  },
  galleryContainer: {
    width: "90%",
    height: "auto",
    maxWidth: 1200,
    backgroundColor: GlobalStyles.lightGrey,
    borderRadius: 25,
    paddingVertical: 20,
    marginBottom: 40,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    height: "100%",
    columnGap: 50,
    rowGap: 20,
    width: "100%",
  },
  videoContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    width: "90%",
    maxWidth: 350,
    height: "auto",
  },
});
