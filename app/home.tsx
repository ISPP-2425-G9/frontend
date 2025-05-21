import ImageCarousel from "@/components/ImageCarousel";
import LineBreak from "@/components/LineBreak";
import Logo from "@/components/Logo";
import SponsorCarousel from "@/components/SponsorCarousel";
import { ThemedText } from "@/components/ThemedText";
import { GlobalStyles } from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useRef } from 'react';
import { Animated, Image, Platform, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";

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
      <View
        style={[styles.carouselGroup, { flexDirection: width > 800 ? "row" : "column"},]} >
        <View style={[styles.carouselItemWrapper, { width: width > 800 ? "50%" : "100%", height: width > 800 ? "100%" : "auto", }]}>
          <ImageCarousel />
        </View>
        <View style={[styles.carouselItemWrapper, { width: width > 800 ? "50%" : "100%", height: width > 800 ? "100%" : "auto", }]}>
          <SponsorCarousel />
        </View>
      </View>
      <View style={styles.featuresContainer}>
        <View style={styles.featuresTitleContainer}>
          <ThemedText style={styles.featuresTitle}>¿Por qué elegirnos?</ThemedText>
          <View style={styles.activeIndicator} />
        </View>
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
      <GallerySection />
      <TeamMembersSection />
    </ScrollView>
  );
}

const videoItems = [
  { videoId: "W9tS8qdiZ08", title: "Para empresas" },
  { videoId: "hn29FdMJoqY", title: "Para inversores" },
  { videoId: "ZW6snDb0S1Y", title: "Para clientes" },
];

const GallerySection: React.FC = () => {
  return (
    <>
      <View style={{ height: 40 }} />
      <View style={styles.featuresTitleContainer}>
        <ThemedText style={styles.featuresTitle}>Galería</ThemedText>
        <View style={styles.activeIndicator} />
      </View>
      <View style={styles.galleryContainer}>
        <View style={styles.galleryGrid}>
          {videoItems.map((item, index) => (
            <View key={index} style={{ alignItems: 'center', margin: 10 }}>
              <ThemedText style={styles.videoCaption}>{item.title}</ThemedText>
              <YoutubeVideo videoId={item.videoId} />
            </View>
          ))}
        </View>
      </View>
    </>
  );
};


const YoutubeVideo: React.FC<{ videoId: string }> = ({ videoId }) => {

  return (
    <View style={styles.videoContainer}>
      <YoutubeIframe
        videoId={videoId}
        height={300}
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
          onMessage: () => (true)
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
      heading: "SEGURIDAD",
      description:
        "Verificación de fallecimiento y cifrado seguro garantizan la integridad de tus mensajes",
    },
    {
      icon: "check-circle",
      heading: "CONFIANZA",
      description:
        "Plataforma transparente y accesible para que no te preocupes por nada",
    },
    {
      icon: "autorenew",
      heading: "AUTOMATIZACIÓN",
      description:
        "Notificaciones automáticas a contactos de emergencia y envío de mensajes sin complicaciones",
    },
    {
      icon: "brush",
      heading: "PERSONALIZACIÓN",
      description:
        "Personaliza mensajes y esquelas con fotos, videos y detalles del funeral",
    },
  ];

const FeatureCard: React.FC<{
  icon: keyof typeof MaterialIcons.glyphMap;
  heading: string;
  description: string;
}> = ({ icon, heading, description }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const flipInterpolationFront = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const flipInterpolationBack = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const handleShowDescription = () => {
    Animated.timing(animatedValue, {
      toValue: 180,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleShowHeading = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const pressableProps =
    Platform.OS === 'web'
      ? { onMouseEnter: handleShowDescription, onMouseLeave: handleShowHeading }
      : { onPressIn: handleShowDescription, onPressOut: handleShowHeading };

  return (
    <Pressable {...pressableProps}>
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.cardFace, { transform: [{ rotateY: flipInterpolationFront }] }]}>
          <MaterialIcons name={icon} size={80} color={GlobalStyles.blue} />
          <ThemedText style={styles.featureCardHeading}>{heading}</ThemedText>
        </Animated.View>
        <Animated.View style={[styles.cardFace, styles.cardBack, { transform: [{ rotateY: flipInterpolationBack }] }]}>
          <ThemedText style={styles.featureCardDescription}>{description}</ThemedText>
        </Animated.View>
      </View>
    </Pressable>
  );
};

export interface TeamMember {
  name: string;
  role: string;
  hobbies: string;
  image: any;
}

export const teamMembers: TeamMember[] = [
  { name: "Hugo Angulo Borrego", role: "Desarrollador Frontend", image: require('@/assets/images/team/hugo.jpeg'), hobbies: "Amante de la tecnología y los gatos" },
  { name: "Álvaro Chico Castellano", role: "Desarrollador Full-Stack y Especialista en Marketing", image: require('@/assets/images/team/alvaro.jpg'), hobbies: "Apasionado de la ingeniería software e interesado en la inteligencia artificial" },
  { name: "Rafael Duque Colete", role: "Desarrollador Frontend", image: require('@/assets/images/team/rafael.jpg'), hobbies: "Amante del fútbol, el deporte y las buenas series" },
  { name: "Daniel Galván Cancio", role: "Coordinador de Marketing y Desarrollador Frontend", image: require('@/assets/images/team/daniel.jpg'), hobbies: "Apasionado de nuevos retos tecnológicos" },
  { name: "Juan García Carballo", role: "Coordinador de Backend y Desarrollador Full-Stack", image: require('@/assets/images/team/juan.jpeg'), hobbies: "Amante de los libros y el cine" },
  { name: "Ángel García Escudero", role: "DevRel y Desarrollador Backend", image: require('@/assets/images/team/angel.jpeg'), hobbies: "Apasionado por la aviación, el deporte y el mundo del motorsport" },
  { name: "Andrés Francisco García Rivero", role: "Desarrollador Frontend", image: require('@/assets/images/team/andres.jpeg'), hobbies: "Apasionado por el motorsport y la electrónica" },
  { name: "David Guillén Fernández", role: "Desarrollador Backend y Especialista en Marketing", image: require('@/assets/images/team/david.jpeg'), hobbies: "Apasionado del deporte y la programación" },
  { name: "Lucas Manuel Herencia Solís", role: "Desarrollador Backend", image: require('@/assets/images/team/lucas.jpeg'), hobbies: "Amante de Java" },
  { name: "Jaime Linares Barrera", role: "Coordinador de Frontend y Desarrollador Frontend", image: require('@/assets/images/team/jaime.jpeg'), hobbies: "Fanático del fútbol y apasionado de la inteligencia artificial" },
  { name: "Jorge Muñoz Rodríguez", role: "Coordinador de Despliegue y Desarrollador DevOps", image: require('@/assets/images/team/jorge.jpeg'), hobbies: "Apasionado por la tecnología y los coches" },
  { name: "Alejandro Pérez Santiago", role: "Desarrollador DevOps", image: require('@/assets/images/team/alejandro.jpg'), hobbies: "Apasionado por la tecnología, siempre enfocado en la mejora continua y en afrontar nuevos retos" },
  { name: "Javier Rodríguez Reina", role: "Desarrollador Backend", image: require('@/assets/images/team/javier.jpeg'), hobbies: "Apasionado de la literatura y los juegos de estrategia" },
  { name: "Isaac Solís Padilla", role: "Desarrollador Backend", image: require('@/assets/images/team/isaac.jpeg'), hobbies: "Amante de los videojuegos" },
  { name: "Karim Youssafi Benichikh", role: "Desarrollador Frontend y Especialista en Marketing", image: require('@/assets/images/team/karim.png'), hobbies: "Amante de la tecnología y la inteligencia artificial" },
];

export const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const flipInterpolationFront = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const flipInterpolationBack = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const flipToBack = () => {
    Animated.timing(animatedValue, {
      toValue: 180,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const flipToFront = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const pressableProps =
    Platform.OS === 'web'
      ? { onMouseEnter: flipToBack, onMouseLeave: flipToFront }
      : { onPressIn: flipToBack, onPressOut: flipToFront };

  return (
    <Pressable {...pressableProps}>
      <View style={styles.teamCardContainer}>
        <Animated.View style={[styles.teamCardFace, { transform: [{ rotateY: flipInterpolationFront }] }]}>
          <Image source={member.image} style={styles.teamImage} />
          <ThemedText style={styles.teamName}>{member.name}</ThemedText>
        </Animated.View>
        <Animated.View style={[styles.teamCardFace, styles.teamCardBack, { transform: [{ rotateY: flipInterpolationBack }] }]}>
          <ThemedText style={styles.teamName}>{member.name}</ThemedText>
          <ThemedText style={styles.teamRole}>{member.role}</ThemedText>
          <ThemedText style={styles.teamHobbies}>{member.hobbies}</ThemedText>
        </Animated.View>
      </View>
    </Pressable>
  );
};

export const TeamMembersSection: React.FC = () => {
  return (
    <>
      <View style={styles.featuresTitleContainer}>
        <ThemedText style={styles.featuresTitle}>Sobre nosotros</ThemedText>
        <View style={styles.activeIndicator} />
      </View>
      <ThemedText style={[styles.subtitle]}>Conoce al equipo detrás de CARONTE</ThemedText>
      <View style={styles.introTextContainer}>
        <ThemedText style={[styles.introText]}>
          <ThemedText style={styles.bold}>CARONTE</ThemedText> nace como una solución digital innovadora en la <ThemedText style={styles.bold}>Universidad de Sevilla</ThemedText>, dentro de la asignatura
          de Ingeniería del Software y Práctica Profesional. Nuestra misión es revolucionar la manera en la que las personas pueden <ThemedText style={styles.bold}>dejar su legado digital</ThemedText>,
          asegurando que sus últimas palabras y mensajes sean entregados en el momento preciso.
        </ThemedText>
        <ThemedText style={[styles.introText]}>
          Detrás de <ThemedText style={styles.bold}>CARONTE</ThemedText> hay un equipo de <ThemedText style={styles.bold}>15 desarrolladores apasionados</ThemedText> que han trabajado para hacer de esta idea una realidad.
          Nuestro equipo está especializado en desarrollo full-stack, asegurando que la experiencia del usuario sea fluida y eficiente.
        </ThemedText>
      </View>

      <View style={styles.teamGrid}>
        {teamMembers.map((member, index) => (
          <TeamMemberCard key={index} member={member} />
        ))}
      </View>
    </>
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
    marginTop: 40,
  },
  carouselContainer: {
    width: "80%",
    position: "relative",
    top: 0,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    margin: 0,
    padding: 0,
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
  carouselGroup: {
    width: '95%',
    marginVertical: 10,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  carouselItemWrapper: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  bold: {
    fontSize: 16,
    fontWeight: "600",
    color: GlobalStyles.darkGrey,
  },
  featuresContainer: {
    alignSelf: "center",
    width: "100%",
    marginTop: 40,
    paddingVertical: 30,
    backgroundColor: GlobalStyles.lightGrey,
  },
  featuresTitleContainer: {
    alignSelf: "center",
  },
  featuresTitle: {
    width: "auto",
    fontSize: 24,
    fontFamily: GlobalStyles.fontBold,
    color: GlobalStyles.blue,
    textAlign: "center",
  },
  activeIndicator: {
    borderBottomWidth: 2,
    borderBottomColor: GlobalStyles.blue,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 100,
  },
  featuresGrid: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    rowGap: 20,
    columnGap: 40,
  },
  featureCardHeading: {
    fontSize: 20,
    marginTop: 8,
    color: GlobalStyles.blue,
    textAlign: "center",
  },
  featureCardDescription: {
    fontSize: 18,
    color: GlobalStyles.grey,
    textAlign: "center",
    paddingHorizontal: 10,
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
    maxWidth: 1500,
    width: "90%",
  },
  teamGrid: {
    width: "90%",
    maxWidth: 1400,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 30,
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
    borderRadius: 25,
    paddingVertical: 20,
    marginBottom: 40,
  },
  videoCaption: {
    width: "100%",
    marginBottom: 10,
    fontSize: 18,
    color: GlobalStyles.darkGrey,
    textAlign: 'center',
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 50,
    rowGap: 20,
  },
  videoContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    aspectRatio: 16 / 9,
    width: 400,
    maxWidth: 600,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
  },
  cardContainer: {
    width: "22%",
    maxWidth: 320,
    aspectRatio: 1,
    minWidth: 250,
    borderRadius: 25,
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
  cardFace: {
    position: 'absolute',
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  cardBack: {
    backgroundColor: "#fff",
    borderRadius: 25,
  },
  teamCardContainer: {
    width: "22%",
    maxWidth: 320,
    aspectRatio: 1,
    minWidth: 250,
    borderRadius: 25,
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
  teamCardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  teamCardBack: {
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  teamImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: GlobalStyles.lightGrey,
    marginBottom: 10,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GlobalStyles.darkGrey,
    textAlign: 'center',
    marginBottom: 5,
  },
  teamRole: {
    fontSize: 16,
    color: GlobalStyles.blue,
    textAlign: 'center',
    marginBottom: 5,
  },
  teamHobbies: {
    fontSize: 14,
    color: GlobalStyles.grey,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
