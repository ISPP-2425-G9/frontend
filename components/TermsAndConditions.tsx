import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { GlobalStyles } from "@/constants/Colors";

const TermsAndConditions: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Términos y Condiciones</Text>
      <Text style={styles.text}>
        En cumplimiento con lo establecido en la Ley 34/2002, de 11 de julio, de Servicios de la 
        Sociedad de la Información y del Comercio Electrónico (LSSICE), y el Reglamento (UE) 
        2016/679 del Parlamento Europeo y del Consejo, relativo a la protección de las personas 
        físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos 
        datos (GDPR), el presente Aviso legal tiene por objeto facilitar información general relativa al 
        propietario del sitio web, informar de los aspectos relativos a los derechos de propiedad intelectual 
        e industrial y regular el uso, incluido el mero acceso, al sitio web.
      </Text>
      <Text style={styles.subtitle}>Información general del propietario del sitio web</Text>
      <Text style={styles.text}>
        Caronte, S.L. \n
        CIF: B-12345678 \n
        Domicilio social: Av. de la Reina Mercedes, 40, Sevilla, España (41012) \n
        Dirección de correo electrónico: info@caronte.site \n
        Datos registrales de la sociedad: Inscrita en el Registro Mercantil de Sevilla, en el tomo 
        45.678, folio 123, hoja M-523456. \n
        Caronte es una marca registrada de Caronte, S.L.
      </Text>
      <Text style={styles.subtitle}>Condiciones de acceso al sitio web y accesibilidad</Text>
      <Text style={styles.text}>
        El acceso a los contenidos generales del sitio web de Caronte es gratuito para todos los 
        usuarios y no requiere suscripción ni registro previo. Este servicio está disponible las 24 horas 
        del día, los 365 días del año, salvo las interrupciones necesarias para el mantenimiento y las 
        mejoras del sistema. \n
        No obstante, el acceso a ciertos servicios y funcionalidades específicas de la plataforma, tales 
        como la creación de esquelas personalizadas o la gestión de mensajes post-mortem, entre 
        otros; estará sujeto a un pago exclusivo o suscripción.
      </Text>
      <Text style={styles.subtitle}>Exoneración de responsabilidades</Text>
      <Text style={styles.text}>
        Caronte no se hace responsable de daños derivados del uso indebido del sitio, del contenido 
        de terceros enlazados o de fallos tecnológicos ajenos. \n
        1. Por uso indebido. Caronte no será responsable de consecuencia, daño o perjuicio alguno 
        derivados del uso indebido de la información contenida en dicha web. \n
        2. Por contenidos de terceros. Caronte no responderá ni garantizará la autenticidad de la información 
        suministrada por terceros. \n
        3. Por fallos tecnológicos ajenos o propios.
      </Text>
      <Text style={styles.subtitle}>Propiedad intelectual</Text>
      <Text style={styles.text}>
        El copyright del material contenido en el sitio web es propiedad de Caronte. La reproducción, distribución 
        o manipulación no autorizada del contenido dará lugar a acciones legales.
      </Text>
      <Text style={styles.subtitle}>Política de privacidad</Text>
      <Text style={styles.text}>
        Recopilamos datos personales como nombre y correo electrónico para gestionar servicios. Implementamos 
        medidas de seguridad estándar para la protección de datos. \n
        Los usuarios tienen derecho a acceder, editar o eliminar sus datos en cualquier momento contactando 
        con info@caronte.site.
      </Text>
      <Text style={styles.subtitle}>Sistema de pagos</Text>
      <Text style={styles.text}>
        Los pagos se procesan a través de plataformas seguras y ofrecemos opciones de reembolso en ciertos 
        casos específicos. \n
        Métodos de pago: \n
        - Suscripción de empresas. \n
        - Suscripción de usuarios. \n
        - Pago único.
      </Text>
      <Text style={styles.subtitle}>Legislación aplicable y resolución de conflictos</Text>
      <Text style={styles.text}>
        Estos términos se rigen por las leyes de España y la normativa de la Unión Europea (GDPR). \n
        En caso de disputa, se someterán a la jurisdicción y competencia exclusiva de los Juzgados y Tribunales 
        del domicilio del usuario o, en su defecto, al domicilio social de Caronte.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: GlobalStyles.blue,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: GlobalStyles.darkGrey,
  },
  text: {
    fontSize: 16,
    color: GlobalStyles.darkGrey,
  },
});

export default TermsAndConditions;
