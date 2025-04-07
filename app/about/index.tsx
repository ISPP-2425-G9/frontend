import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export const teamMembers = [
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

const AboutUs = () => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useFocusEffect(
    React.useCallback(() => {
      document.title = 'Sobre nosotros';
    }, [])
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Animated.Text style={[styles.mainTitle, { opacity: fadeAnim }]}>Sobre nosotros</Animated.Text>
        <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>Conoce al equipo detrás de CARONTE</Animated.Text>

        <View style={styles.introTextContainer}>
          <Animated.Text style={[styles.introText, { opacity: fadeAnim }]}>
            <Text style={styles.bold}>CARONTE</Text> nace como una solución digital innovadora en la <Text style={styles.bold}>Universidad de Sevilla</Text>, dentro de la asignatura
            de Ingeniería del Software y Práctica Profesional. Nuestra misión es revolucionar la manera en la que las personas pueden <Text style={styles.bold}>dejar su legado digital</Text>,
            asegurando que sus últimas palabras y mensajes sean entregados en el momento preciso.
          </Animated.Text>
          <Animated.Text style={[styles.introText, { opacity: fadeAnim }]}>
            Detrás de <Text style={styles.bold}>CARONTE</Text> hay un equipo de <Text style={styles.bold}>15 desarrolladores apasionados</Text> que han trabajado para hacer de esta idea una realidad.
            Nuestro equipo está especializado en desarrollo full-stack, asegurando que la experiencia del usuario sea fluida y eficiente.
          </Animated.Text>
        </View>

        <Animated.Text style={[styles.teamIntro, { opacity: fadeAnim }]}>
          ▼ Aquí te presentamos a los miembros que hacen esto posible ▼
        </Animated.Text>

        <View style={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.teamMember} testID={`team-member-${index}`}>
              <Image source={member.image} style={styles.memberImage} />
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole} testID={`role-${index}`}>
                {member.role}
              </Text>
              <Text style={styles.hobbies} testID={`hobbies-${index}`}>
                <Text style={styles.bold}>Aficiones:</Text> {member.hobbies}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
    borderRadius: 10,
    padding: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  introTextContainer: {
    marginBottom: 20,
  },
  introText: {
    fontSize: 16,
    textAlign: 'justify',
    color: '#444',
    marginBottom: 15,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  teamIntro: {
    fontSize: 20,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  teamMember: {
    width: '45%',
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#ccc',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  memberImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#333',
  },
  memberRole: {
    fontSize: 14,
    color: '#888',
    marginVertical: 5,
  },
  hobbies: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
});

export default AboutUs;
