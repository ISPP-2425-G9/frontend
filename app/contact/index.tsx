import React, { useEffect } from "react";
import { View, Text, TextInput, Button, Linking, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

const { width } = Dimensions.get("window"); // Obtener el ancho de la pantalla

const Contact = () => {
  useEffect(() => {}, []);

  const handleSubmit = (name: string, email: string, message: string) => {
    const subject = `Mensaje de ${name} (${email})`;
    const body = encodeURIComponent(message);
    Linking.openURL(`mailto:info@caronte.site?subject=${encodeURIComponent(subject)}&body=${body}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contactContainer}>
        <Text style={styles.contactTitle}>Contáctanos</Text>
        <Text style={styles.contactSubtitle}>
          ¿Tienes alguna duda, sugerencia o simplemente quieres saludarnos?{"\n"}
          No dudes en ponerte en contacto con nosotros.
        </Text>

        <View style={styles.contactDetails}>
          {/* Contenedor del formulario y la información de contacto */}
          <View style={styles.contactFormWrapper}>
            <View style={styles.contactForm}>
              <Text style={styles.formTitle}>Envíanos un mensaje</Text>
              <TextInput style={styles.input} placeholder="Nombre" />
              <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
              <TextInput
                style={styles.textArea}
                placeholder="Tu mensaje"
                multiline
                numberOfLines={4}
              />
              <TouchableOpacity style={styles.button} onPress={() => handleSubmit("nombre", "email@dominio.com", "Mensaje de prueba")}>
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Icon name="envelope" size={20} color="#4CAF50" />
                <Text>
                  <TouchableOpacity onPress={() => Linking.openURL("mailto:info@caronte.site")}>
                    <Text style={styles.contactLink}>info@caronte.site</Text>
                  </TouchableOpacity>
                </Text>
              </View>

              <View style={styles.contactItem}>
                <Icon name="phone" size={20} color="#4CAF50" />
                <Text>
                  <TouchableOpacity onPress={() => Linking.openURL("tel:+34615145215")}>
                    <Text style={styles.contactLink}>+34 615 14 52 15</Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.socialMedia}>
        <Text style={styles.socialMediaTitle}>Nuestras redes sociales</Text>
        <View style={styles.socialIcons}>
          <TouchableOpacity onPress={() => Linking.openURL("https://whatsapp.com/channel/0029Vb8vAcUDzgTBG01Tdw1f")}>
            <Icon name="whatsapp" size={30} color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://www.linkedin.com/in/caronte-app/")}>
            <Icon name="linkedin" size={30} color="#0077B5" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://www.facebook.com/profile.php?id=61573575124143")}>
            <Icon name="facebook" size={30} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://x.com/CaronteApp")}>
            <Icon name="x-twitter" size={30} color="#1DA1F2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://instagram.com/caronteapp")}>
            <Icon name="instagram" size={30} color="#C13584" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://www.tiktok.com/@caronteapp")}>
            <Icon name="tiktok" size={30} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://github.com/ISPP-2425-G9")}>
            <Icon name="github" size={30} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contactContainer: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    alignSelf: "center",
  },
  contactSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
    alignSelf: "center",
  },
  contactDetails: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactFormWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  contactForm: {
    flex: 1,
    marginRight: 20,
  },
  contactInfo: {
    flex: 1,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    width: '100%',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 100,
    fontSize: 16,
    width: '100%',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
  },
  contactLink: {
    color: '#4CAF50',
    fontSize: 16,
  },
  socialMedia: {
    marginBottom: 20,
  },
  socialMediaTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    alignSelf: "center",
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
});

export default Contact;
