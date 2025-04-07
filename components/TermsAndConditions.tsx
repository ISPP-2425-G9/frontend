import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { GlobalStyles } from "@/constants/Colors";
import LineBreak from "./LineBreak";

const TermsAndConditions: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>1. Aviso legal</Text>
      <Text style={styles.text}>
        En cumplimiento con lo establecido en la Ley 34/2002, de 11 de julio, de
        Servicios de la Sociedad de la Información y del Comercio Electrónico
        (LSSICE), y el Reglamento (UE) 2016/679 del Parlamento Europeo y del
        Consejo, relativo a la protección de las personas físicas en lo que
        respecta al tratamiento de datos personales y a la libre circulación de
        estos datos (GDPR), el presente Aviso legal tiene por objeto facilitar
        información general relativa al propietario del sitio web, informar de
        los aspectos relativos a los derechos de propiedad intelectual e
        industrial y regular el uso, incluido el mero acceso, al sitio web.
      </Text>
      <LineBreak />
      <Text style={styles.title}>
        2. Condiciones de acceso al sitio web y accesibilidad
      </Text>
      <Text style={styles.text}>
        El acceso a los contenidos generales del sitio web de Caronte es
        gratuito para todos los usuarios y no requiere suscripción ni registro
        previo. Este servicio está disponible las 24 horas del día, los 365 días
        del año, salvo las interrupciones necesarias para el mantenimiento y las
        mejoras del sistema. No obstante, el acceso a ciertos servicios y
        funcionalidades específicas de la plataforma, tales como la creación de
        esquelas personalizadas o la gestión de mensajes post-mortem, entre
        otros; estará sujeto a un pago exclusivo o suscripción. Los servicios de
        pago estarán claramente indicados y requerirán la contratación de un
        plan o el pago de una tarifa única, según corresponda. El usuario es
        informado de que al pulsar en los enlaces (links) que le redirija a webs
        de terceras empresas, deja de navegar en el sitio web de Caronte,
        exonerando a esta entidad de cualquier responsabilidad, daño o perjuicio
        en la contratación con las terceras empresas o en la información que
        pueda ser facilitada por estas.
      </Text>
      <LineBreak />
      <Text style={styles.title}>3. Exoneración de responsabilidad</Text>
      <Text style={styles.text}>
        Al navegar en nuestro sitio web, el usuario exonera a Caronte en los
        siguientes casos:
      </Text>
      <View style={styles.bulletList}>
        <Text style={styles.bulletItem}>
          <Text style={styles.bold}>Por uso indebido:</Text> Al acceder al sitio
          web de Caronte, se acepta que Caronte no será responsable de
          consecuencia, daño o perjuicio alguno derivados del uso indebido de la
          información contenida en dicha web, o del acceso indebido a otras
          materias en Internet a través de las conexiones con esta página web.
        </Text>
        <Text style={styles.bulletItem}>
          <Text style={styles.bold}>Por contenidos de terceros:</Text> El sitio
          web puede contener enlaces de hipertexto redirigidos hacia otras
          páginas de la World Wide Web que son completamente independientes de
          este sitio web. Caronte no responderá ni garantizará, en modo alguno,
          por la inexactitud, insuficiencia o falta de autenticidad de la
          información suministrada por dichos terceros.
        </Text>
        <Text style={styles.bulletItem}>
          <Text style={styles.bold}>Por fallos tecnológicos:</Text>
          {<LineBreak />}- De los posibles daños o perjuicios derivados de
          interferencias, omisiones, interrupciones, virus informáticos, averías
          telefónicas o desconexiones en el funcionamiento operativo del sistema
          elegido, motivadas por causas ajenas a esta entidad.
          {<LineBreak />}- De retrasos o bloqueos en el uso del sistema elegido
          causados por deficiencias o sobrecargas de líneas telefónicas o
          sobrecargas en el Centro de Proceso de Datos usados, en este caso por
          proveedores externos, en el sistema de internet o en otros sistemas
          electrónicos.
          {<LineBreak />}- De daños ocasionados por terceras personas mediante
          intromisiones ilegítimas fuera del control de Caronte.
        </Text>
        <Text style={styles.bulletItem}>
          <Text style={styles.bold}>
            Por la veracidad o validez de los certificados de defunción
            proporcionados por los usuarios:
          </Text>{" "}
          Caronte no se hace responsable de la veracidad o validez de los
          certificados de defunción proporcionados por los usuarios. Es
          responsabilidad del usuario asegurarse de que los documentos y la
          información proporcionada sean correctos y válidos. Caronte solo
          actuará como intermediario para procesar los servicios solicitados y
          no valida la exactitud de la información suministrada por los
          usuarios.
        </Text>
      </View>
      <LineBreak />
      <Text style={styles.title}>4. Propiedad intelectual</Text>
      <Text style={styles.text}>
        El copyright del material contenido en el sitio web es propiedad de
        Caronte, salvo aquellos que pertenezcan a sus empresas colaboradoras con
        las que exista firmado el correspondiente contrato. El acceso gratuito a
        los contenidos generales al sitio web no implica otros derechos o
        licencias para su reproducción y/o distribución sin la autorización
        expresa de Caronte. Las marcas, logotipos, diseños, imágenes, mapas,
        banners, contenidos, software y sus distintos códigos fuente y objeto y
        demás elementos integradores de esta web están protegidos por las leyes
        de propiedad industrial e intelectual y tratados internacionales, sin
        que puedan considerarse “fuentes de acceso público”. La reproducción,
        distribución, manipulación o desensamblaje no autorizado del código
        fuente, de los algoritmos incorporados, o de las bases de datos, ya sea
        total o parcial, dará lugar a graves penalizaciones tanto civiles como
        penales y será objeto de cuantas acciones judiciales correspondan en
        derecho.
      </Text>
      <LineBreak />
      <Text style={styles.title}>
        5. LSSICE. Ley de Servicios de la Sociedad de la Información y Comercio
        Electrónico
      </Text>
      <Text style={styles.text}>
        Caronte, S.L. se compromete a cumplir con las obligaciones derivadas de
        la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
        Información y Comercio Electrónico. En cumplimiento de lo establecido en
        el artículo 10 de la mencionada ley, se le informa que los datos
        identificativos completos de Caronte se encuentran detallados en el
        primer apartado de este Aviso legal sobre “Identificación de la
        empresa”. Para ponerse en contacto con Caronte, la página web pone a su
        disposición diferentes canales de contacto:
      </Text>
      <View style={styles.bulletList}>
        <Text style={styles.bulletItem}>
          <Text style={styles.bold}>Correo electrónico:</Text> info@caronte.site
        </Text>
        <Text style={styles.bulletItem}>
          <Text style={styles.bold}>Teléfono de atención al cliente:</Text> +34
          615 14 52 15
        </Text>
        <Text style={styles.bulletItem}>
          <Text style={styles.bold}>Formulario de contacto:</Text>{" "}
          https://www.caronte.site/contact
        </Text>
        <Text style={styles.bulletItem}>
          <Text style={styles.bold}>Dirección postal:</Text> Av. de la Reina
          Mercedes, s/n, 41012 Sevilla
        </Text>
        <Text style={styles.bulletItem}>
          <Text style={styles.bold}>Redes sociales:</Text>
          {<LineBreak />}- WhatsApp:
          https://www.whatsapp.com/channel/0029Vb8vAcUDzgTBG01Tdw1f
          {<LineBreak />}- LinkedIn: https://www.linkedin.com/in/caronte-app/
          {<LineBreak />}- X: https://x.com/CaronteApp
          {<LineBreak />}- Instagram: https://www.instagram.com/caronte_es/
          {<LineBreak />}- TikTok: https://www.tiktok.com/@caronteapp
          {<LineBreak />}- GitHub: https://github.com/ISPP-2425-G9
          {<LineBreak />}- Facebook:
          https://www.facebook.com/profile.php?id=61573575124143
        </Text>
      </View>
      <LineBreak />
      <Text style={styles.title}>6. Objeto de la web</Text>
      <Text style={styles.text}>
        Las páginas contenidas en el sitio web de Caronte tienen por objeto
        facilitar el conocimiento por el público en general de Caronte, de las
        actividades que realiza y de los servicios que presta. Esta entidad se
        reserva la facultad de efectuar, en cualquier momento y sin previo
        aviso, modificaciones de la información contenida en su página web o en
        la configuración y presentación de la misma.
      </Text>
      <LineBreak />
      <Text style={styles.title}>7. Términos de uso</Text>
      <Text style={styles.subtitle}>
        7.1. Aceptación de los términos de uso
      </Text>
      <Text style={styles.text}>
        Al acceder o utilizar el sitio web de Caronte, el usuario acepta cumplir
        con estos Términos de uso. Caronte se reserva el derecho de modificar
        estos términos en cualquier momento y sin previo aviso. Las
        modificaciones se publicarán en la página oficial de Caronte y entrarán
        en vigor inmediatamente después de su publicación.
      </Text>
      <Text style={styles.subtitle}>7.2. Uso del sitio web</Text>
      <Text style={styles.text}>
        El sitio web de Caronte permite a los usuarios crear, personalizar y
        gestionar esquelas y mensajes post-mortem, además de la contratación y
        publicitación de servicios funerarios externos con otras empresas. Los
        usuarios deben registrarse en la plataforma para poder hacer uso de
        estos servicios con una dirección de correo electrónico válida y
        seleccionar un plan de servicio adecuado a sus necesidades.
      </Text>
      <Text style={styles.subtitle}>7.2.1. Registro de Usuario</Text>
      <Text style={styles.text}>
        Durante el proceso de registro se solicitarán los siguientes datos:
        {<LineBreak />}- Correo electrónico: dirección válida para autenticación
        y notificaciones.{<LineBreak />}- DNI/NIF: único y válido para clientes
        y empresas.{<LineBreak />}- Nombre completo: nombre personal o de la
        empresa.{<LineBreak />}- Número de teléfono: para contacto directo en
        caso de urgencias.{<LineBreak />}- Contraseña: debe cumplir requisitos
        de seguridad.
      </Text>
      <Text style={styles.subtitle}>7.2.2. Tipos de Usuario</Text>
      <Text style={styles.text}>
        - Usuarios con Plan: gestionan y contratan servicios anticipadamente.
        {<LineBreak />}- Usuarios sin Plan: representantes o familiares tras el
        fallecimiento.{<LineBreak />}- Patrocinadores: empresas que promocionan
        sus servicios en la plataforma.
      </Text>
      <Text style={styles.subtitle}>
        7.2.3. Gestión de Planes y Suscripciones
      </Text>
      <Text style={styles.text}>
        Caronte ofrece diferentes planes, como Plan Free y Plan Premium, para
        usuarios y empresas, y los patrocinadores pueden ofrecer sus servicios a
        través de la plataforma.
      </Text>
      <Text style={styles.subtitle}>
        7.2.4. Creación y Personalización de Esquelas y Mensajes
      </Text>
      <Text style={styles.text}>
        Los usuarios pueden crear y personalizar esquelas y mensajes post-mortem
        seleccionando plantillas prediseñadas, gestionar el historial y asignar
        destinatarios para envíos por correo electrónico o SMS. Los usuarios con
        planes de suscripción pueden acceder a funcionalidades avanzadas.
      </Text>
      <Text style={styles.subtitle}>7.2.5. Validación del Fallecimiento</Text>
      <Text style={styles.text}>
        Se requiere la subida del certificado de defunción para activar el envío
        de mensajes. Además, en caso de inactividad prolongada, se notificarán
        los contactos de emergencia.
      </Text>
      <Text style={styles.subtitle}>
        7.2.6. Distribución Digital de Esquelas y Mensajes
      </Text>
      <Text style={styles.text}>
        Los mensajes y esquelas se pueden enviar digitalmente mediante correo
        electrónico, SMS, generación de enlaces compartibles o descarga en PDF.
      </Text>
      <Text style={styles.subtitle}>
        7.2.7. Gestión de Contactos de Emergencia
      </Text>
      <Text style={styles.text}>
        Los usuarios pueden agregar, editar o eliminar contactos de emergencia,
        quienes serán notificados en caso de inactividad prolongada o inicio del
        proceso de validación del fallecimiento.
      </Text>
      <Text style={styles.subtitle}>7.2.8. Accesibilidad y Usabilidad</Text>
      <Text style={styles.text}>
        La plataforma está diseñada para ser intuitiva y accesible, optimizada
        para usuarios con poca experiencia tecnológica y compatible con
        múltiples dispositivos.
      </Text>
      <Text style={styles.subtitle}>7.2.9. Gestión de Servicios Externos</Text>
      <Text style={styles.text}>
        Además de los servicios propios de Caronte, los usuarios pueden
        contratar servicios externos, como floristerías, tanatorios o
        aseguradoras, directamente a través del portal.
      </Text>
      <Text style={styles.subtitle}>7.3. Restricciones de uso</Text>
      <Text style={styles.text}>
        El usuario se compromete a utilizar Caronte conforme a las leyes
        aplicables, incluyendo la Ley 34/2002, el Reglamento (UE) 2016/679, la
        Ley Orgánica 3/2018 y el Código Penal español. Se prohíbe subir
        contenido ilegal, difamatorio, obsceno o que infrinja derechos de
        terceros, así como utilizar la plataforma para fines fraudulentos o
        maliciosos.
      </Text>
      <LineBreak />
      <Text style={styles.title}>8. Política de privacidad</Text>
      <Text style={styles.subtitle}>8.1. Información que recopilamos</Text>
      <Text style={styles.text}>
        Cuando los usuarios interactúan con el sitio web de Caronte, recopilamos
        la siguiente información personal de manera explícita y voluntaria:
        {<LineBreak />}- Datos personales: Nombre completo, dirección de correo
        electrónico, número de teléfono, DNI/NIF y contraseña.{<LineBreak />}-
        Certificados de defunción: Cargado por el usuario o sus contactos de
        emergencia tras el fallecimiento.{<LineBreak />}- Datos de pago (si
        aplica): Dirección de facturación y detalles de la tarjeta de
        crédito/débito, en este caso el nombre y los apellidos del propietario
        de la tarjeta, cvv, fecha de expiración y fecha que se realizó el pago;
        el resto de datos, si se realiza el pago por PayPal o por la plataforma
        externa de Stripe, no se almacenan en nuestras bases de datos.
        {<LineBreak />}- Información sobre Contactos de Emergencia (si aplica):
        Nombre completo del contacto de emergencia, número de teléfono y
        dirección de correo electrónico de dicho contacto.{<LineBreak />}-
        Información sobre Esquelas y Mensajes: Contenido de la esquela o mensaje
        y la lista de destinatarios, siendo estos los correos electrónicos y
        números de teléfono de las personas a quienes se enviarán las esquelas y
        mensajes.
      </Text>
      <Text style={styles.subtitle}>8.2. Uso de la información</Text>
      <Text style={styles.text}>
        La información recopilada se utilizará para:{<LineBreak />}- Gestionar y
        procesar los servicios solicitados por los usuarios.{<LineBreak />}-
        Enviar comunicaciones relacionadas con los servicios, actualizaciones y
        notificaciones importantes.{<LineBreak />}- Cumplir con las obligaciones
        legales y de seguridad.
      </Text>
      <Text style={styles.subtitle}>8.3. Declaración de confidencialidad</Text>
      <Text style={styles.text}>
        Caronte se compromete a proteger la confidencialidad de toda la
        información personal proporcionada por los usuarios, especialmente los
        datos relacionados con fallecimientos. Cualquier información sensible
        será tratada de acuerdo con las normativas de protección de datos
        personales y no será divulgada a terceros sin el consentimiento
        explícito del usuario, salvo en los casos establecidos por la ley.
      </Text>
      <Text style={styles.subtitle}>
        8.4. Protección de la información post-mortem
      </Text>
      <Text style={styles.text}>
        Caronte se compromete a gestionar la información relacionada con el
        fallecimiento de los usuarios de manera confidencial y segura,
        garantizando que se maneja de acuerdo con las normativas de protección
        de datos vigentes. Esta información sólo será compartida con las partes
        autorizadas por el usuario o según lo exijan las leyes aplicables.
        {<LineBreak />}
        En particular, la información post-mortem se gestionará conforme a las
        siguientes leyes y normativas:{<LineBreak />}- Reglamento (UE) 2016/679
        del Parlamento Europeo y del Consejo (GDPR).{<LineBreak />}- Ley
        Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y
        garantía de los derechos digitales.{<LineBreak />}- Ley 34/2002, de 11
        de julio, de Servicios de la Sociedad de la Información y del Comercio
        Electrónico (LSSICE).{<LineBreak />}- Código Civil Español, en lo que
        respecta a los derechos sobre los últimos deseos y la gestión de bienes
        y testamentos.
      </Text>
      <Text style={styles.subtitle}>8.5. Seguridad de los datos</Text>
      <Text style={styles.text}>
        Caronte implementa medidas de seguridad estándar para proteger la
        información personal, como el cifrado de datos usando SSL/TLS y el
        almacenamiento seguro utilizando cifrado avanzado basado en AES. Sin
        embargo, se reserva el derecho a no garantizar la seguridad absoluta de
        los datos transmitidos a través de Internet.
      </Text>
      <Text style={styles.subtitle}>8.6. Conservación de datos</Text>
      <Text style={styles.text}>
        Conservaremos tus datos personales durante el tiempo necesario para
        cumplir con los fines descritos en esta Política de privacidad y en
        cumplimiento con la legislación vigente.{<LineBreak />}
        En particular, los datos serán conservados conforme a las siguientes
        leyes y regulaciones:{<LineBreak />}- Reglamento (UE) 2016/679 (GDPR).
        {<LineBreak />}- Ley Orgánica 3/2018, de 5 de diciembre, de Protección
        de Datos Personales y garantía de los derechos digitales.{<LineBreak />}
        - Ley 34/2002 (LSSICE).{<LineBreak />}- Código Civil español, respecto a
        la conservación de datos relativos a la última voluntad y testamento.
        {<LineBreak />}- Ley 25/2007, de 18 de octubre, de conservación de datos
        relativos a las comunicaciones electrónicas y redes públicas de
        comunicaciones.{<LineBreak />}
        Caronte tomará todas las medidas necesarias para garantizar que los
        datos personales se eliminen de manera segura una vez que ya no sean
        necesarios o cuando el usuario ejerza su derecho a la cancelación, de
        acuerdo con las leyes aplicables.
      </Text>
      <Text style={styles.subtitle}>8.7. Derechos de los usuarios</Text>
      <Text style={styles.text}>
        Los usuarios tienen el derecho de acceder, editar o eliminar sus datos
        personales en cualquier momento. Para ejercer estos derechos, pueden
        contactar con nuestro equipo de soporte en info@caronte.site.
      </Text>
      <LineBreak />
      <Text style={styles.title}>9. Sistema de pagos</Text>
      <Text style={styles.subtitle}>9.1. Métodos de pago</Text>
      <Text style={styles.bold}>
        1. Suscripción de Empresas (Patrocinadores):
      </Text>
      {<LineBreak />}- Suscripción de empresas. Para servicios de
      patrocinadores.
      {<LineBreak />}{" "}
      <Text style={styles.bold}>
        2. Suscripción de Usuarios (Clientes Particulares):
      </Text>{" "}
      {<LineBreak />}- Suscripción de usuarios. Para usuarios que deseen acceso
      continuo a servicios como la creación de esquelas y mensajes.{" "}
      {<LineBreak />}- Pago único. Para usuarios que deseen crear una esquela
      sin suscripción.
      {<LineBreak />}
      <Text style={styles.subtitle}>9.2. Seguridad de pagos</Text>
      <Text style={styles.text}>
        Todos los pagos se procesan a través de plataformas de pago seguras. No
        almacenamos información financiera directamente en nuestra plataforma
        sino que se procesa en plataformas externas como stripe o paypal,
        asegurando la privacidad y seguridad de sus datos.
      </Text>
      <LineBreak />
      <Text style={styles.subtitle}>9.3. Política de reembolso</Text>
      <Text style={styles.text}>
        Los usuarios pueden solicitar un reembolso en caso de que se produzca un
        error en el procesamiento del pago o si no se ha proporcionado el
        servicio adquirido. Las solicitudes de reembolso deben realizarse dentro
        de los 14 días posteriores al pago. No se ofrecerán reembolsos una vez
        que el servicio haya sido prestado de acuerdo con los términos
        acordados.
      </Text>
      <LineBreak />
      <Text style={styles.subtitle}>
        9.4. Condiciones de cancelación de servicios
      </Text>
      <Text style={styles.text}>
        Los usuarios pueden cancelar su suscripción en cualquier momento, desde
        su cuenta en el sitio web o poniéndose en contacto con nuestro equipo de
        soporte. En caso de cancelación, se interrumpirán los servicios
        asociados a la suscripción, pero no se ofrecerá reembolso por los
        servicios ya prestados. La cancelación no afectará a los derechos que
        correspondan por servicios ya proporcionados.
      </Text>
      <LineBreak />
      <Text style={styles.title}>10. Supervisión de contenido</Text>
      <Text style={styles.subtitle}>
        10.1. Supervisión de esquelas y mensajes
      </Text>
      <Text style={styles.text}>
        Caronte se reserva el derecho de revisar y moderar el contenido subido
        por los usuarios, incluidos mensajes y esquelas. Si el contenido
        infringe nuestros Términos de uso o las leyes aplicables, siendo estas:
        {<LineBreak />}- Ley 34/2002, de 11 de julio, de Servicios de la
        Sociedad de la Información y del Comercio Electrónico (LSSICE).
        {<LineBreak />}- Reglamento (UE) 2016/679 relativo a la protección de
        las personas físicas en lo que respecta al tratamiento de datos
        personales (GDPR).{<LineBreak />}- Código Penal Español.{<LineBreak />}-
        Ley 1/1982, de 5 de mayo, de la protección civil del derecho al honor, a
        la intimidad personal y familiar y a la propia imagen.{<LineBreak />}-
        Ley 23/2006, de 7 de julio, sobre la propiedad intelectual.
        {<LineBreak />}
        En particular, Caronte se asegura de que el contenido sea respetuoso,
        legal y no infrinja los derechos de terceros. Si el contenido subido por
        el usuario infringe cualquiera de lo anterior, Caronte se reserva el
        derecho de eliminarlo sin previo aviso.
      </Text>
      <Text style={styles.subtitle}>10.2. Responsabilidad del usuario</Text>
      <Text style={styles.text}>
        El usuario es responsable del contenido que sube a la plataforma,
        asegurando que no infrinja los derechos de propiedad intelectual ni las
        leyes de privacidad recogidas por la Ley 23/2006, de 7 de julio, de
        propiedad intelectual, la Ley 17/2001, de 7 de diciembre, de marcas, la
        Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos
        Personales y garantía de los derechos digitales y el Reglamento (UE)
        2016/679 (GDPR). En caso de detectar una infracción, Caronte procederá a
        retirar el contenido y suspender o cancelar la cuenta del usuario
        infractor.
      </Text>
      <LineBreak />
      <Text style={styles.title}>11. Responsabilidades y obligaciones</Text>
      <Text style={styles.subtitle}>11.1. Usuarios con plan</Text>
      <Text style={styles.text}>
        Caronte se reserva el derecho a suspender un plan adquirido previamente
        en caso de impago. Además, los usuarios (clientes) que contraten un plan
        se comprometen a mantener su suscripción activa. Si se cancela por falta
        de pago, Caronte notificará a los contactos de emergencia para validar
        el fallecimiento y, de ser necesario, activar los servicios post-mortem.
        {<LineBreak />}
        Las empresas patrocinadoras pueden retirar su información publicitada en
        cualquier momento, accediendo a la sección de administración para
        actualizar o eliminar su perfil.{<LineBreak />}
        Los clientes (usuarios particulares) pueden cancelar su suscripción o
        plan en cualquier momento; en tal caso, se interrumpirán los servicios
        asociados sin reembolso por los ya prestados.
      </Text>
      <Text style={styles.subtitle}>11.2. Administradores</Text>
      <Text style={styles.text}>
        Los administradores de Caronte son responsables de gestionar los
        perfiles de usuario y patrocinadores, asegurando que todos los servicios
        se ofrezcan conforme a las normativas de la plataforma.
      </Text>
      <LineBreak />
      <Text style={styles.title}>
        12. Legislación aplicable y resolución de conflictos
      </Text>
      <Text style={styles.text}>
        Estos Términos y condiciones se rigen por las leyes de España y la
        legislación de la Unión Europea, incluyendo el Reglamento (UE) 2016/679
        (GDPR). En caso de disputa derivada de la existencia, acceso,
        utilización o contenido de estos términos o del sitio web, tanto el
        usuario como la entidad, renunciando expresamente a cualquier otro
        fuero, se someterán a la jurisdicción exclusiva de los Juzgados y
        Tribunales del domicilio del usuario.{<LineBreak />}
        Si el domicilio del usuario se encuentra fuera de España, ambas partes
        se someten a la jurisdicción de los Juzgados y Tribunales del domicilio
        social de Caronte.
      </Text>
      <LineBreak />
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
    textAlign: "justify"
  },
  bulletList: {
    marginLeft: 15,
    marginBottom: 10,
  },
  bulletItem: {
    marginBottom: 10,
    fontSize: 16,
    color: GlobalStyles.darkGrey,
  },
  bold: {
    fontSize: 16,
    fontWeight: "bold",
    color: GlobalStyles.darkGrey,
  },
});

export default TermsAndConditions;
