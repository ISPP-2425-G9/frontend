import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import Icon from "react-native-vector-icons/FontAwesome6";

const Contact: React.FC = () => {
  // Animation refs
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const detailsAnim = useRef(new Animated.Value(0)).current;
  const extraInfoAnim = useRef(new Animated.Value(0)).current;
  const socialAnim = useRef(new Animated.Value(0)).current;

  // Form state
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Title animation after 100ms, duration 800ms
    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 800,
      delay: 100,
      useNativeDriver: true,
    }).start();

    // Subtitle animation after 250ms, duration 1000ms
    Animated.timing(subtitleAnim, {
      toValue: 1,
      duration: 1000,
      delay: 250,
      useNativeDriver: true,
    }).start();

    // Contact details animation after 400ms, duration 1200ms
    Animated.timing(detailsAnim, {
      toValue: 1,
      duration: 1200,
      delay: 400,
      useNativeDriver: true,
    }).start();

    // Extra Info animation after 800ms, duration 1200ms
    Animated.timing(extraInfoAnim, {
      toValue: 1,
      duration: 1200,
      delay: 800,
      useNativeDriver: true,
    }).start();

    // Social media animation after 1000ms, duration 1200ms
    Animated.timing(socialAnim, {
      toValue: 1,
      duration: 1200,
      delay: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert("Error", "Por favor, llena todos los campos.");
      return;
    }
    const subject = `Mensaje de ${name} (${email})`;
    const body = encodeURIComponent(message);
    Linking.openURL(
      `mailto:info@caronte.site?subject=${encodeURIComponent(
        subject
      )}&body=${body}`
    );
  };

  // Google Maps embed URL from the original iframe
  const googleMapHTML = `
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
        <style>
          body, html { margin: 0; padding: 0; height: 100%; }
          iframe { border: 0; width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6342.67312084915!2d-5.989684023552625!3d37.358212536045464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd126dd4a3055555%3A0x29c3f634f8a021b8!2sEscuela%20T%C3%A9cnica%20Superior%20de%20Ingenier%C3%ADa%20Inform%C3%A1tica!5e0!3m2!1ses!2ses!4v1741824402518!5m2!1ses!2ses"
                width="600"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación"
              ></iframe>
      </body>
    </html>
  `;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <Animated.Text style={[styles.title, { opacity: titleAnim }]}>
          Contáctanos
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, { opacity: subtitleAnim }]}>
          ¿Tienes alguna duda, sugerencia o simplemente quieres saludarnos?{"\n"}
          No dudes en ponerte en contacto con nosotros.
        </Animated.Text>

        <Animated.View style={[styles.detailsContainer, { opacity: detailsAnim }]}>
          <View style={styles.halfContainer}>
            <Text style={styles.sectionTitle}>Ubicación</Text>
            <View style={styles.mapContainer}>
              <WebView 
                originWhitelist={["*"]}
                source={{ html: googleMapHTML }}
                style={{ flex: 1 }}
              />
            </View>
          </View>

          <View style={styles.halfContainer}>
            <Text style={styles.sectionTitle}>Envíanos un mensaje</Text>
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tu mensaje"
                placeholderTextColor="#888"
                multiline
                numberOfLines={4}
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.extraInfoContainer, { opacity: extraInfoAnim }]}>
          <View style={styles.contactItem}>
            <Text style={styles.icon}>✉️</Text>
            <TouchableOpacity onPress={() => Linking.openURL("mailto:info@caronte.site")}>
              <Text style={styles.contactLink}>info@caronte.site</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.icon}>📞</Text>
            <TouchableOpacity onPress={() => Linking.openURL("tel:+34615145215")}>
              <Text style={styles.contactLink}>+34 615 14 52 15</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={[styles.socialContainer, { opacity: socialAnim }]}>
          <Text style={styles.sectionTitle}>Nuestras redes sociales</Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity onPress={() => Linking.openURL("https://whatsapp.com/channel/0029Vb8vAcUDzgTBG01Tdw1f")}>
              <Icon name="whatsapp" size={30} color="#42B5FC" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL("https://www.linkedin.com/in/caronte-app/")}>
              <Icon name="linkedin" size={30} color="#42B5FC" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL("https://www.facebook.com/profile.php?id=61573575124143")}>
              <Icon name="facebook" size={30} color="#42B5FC" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL("https://x.com/CaronteApp")}>
              <Icon name="x-twitter" size={30} color="#42B5FC" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL("https://instagram.com/caronteapp")}>
              <Icon name="instagram" size={30} color="#42B5FC" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL("https://www.tiktok.com/@caronteapp")}>
              <Icon name="tiktok" size={30} color="#42B5FC" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL("https://github.com/ISPP-2425-G9")}>
              <Icon name="github" size={30} color="#42B5FC" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#555",
    marginBottom: 20,
    lineHeight: 28,
    textAlign: "center",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    width: "100%",
    marginTop: 30,
  },
  halfContainer: {
    flex: 1,
    minWidth: 300,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  mapContainer: {
    flex: 1,
    height: 300,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#42B5FC",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  extraInfoContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    flexWrap: "wrap",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  contactLink: {
    fontSize: 18,
    color: "#42B5FC",
    fontWeight: "bold",
  },
  socialContainer: {
    marginTop: 30,
    alignItems: "center",
    width: "100%",
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    marginTop: 10,
  },
});

export default Contact;