import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';


interface PlanCardProps {
  role: 'CUSTOMER_FREE' | 'CUSTOMER_PREMIUM' | 'COMPANY_FREE' | 'COMPANY_PREMIUM';
}

const PlanCard: React.FC<PlanCardProps> = ({ role }) => {
  const plan = role.split('_')[1].toLowerCase();
  const isPremium = plan === 'premium';
  const isCustomer = role.includes('CUSTOMER');

  const getPlanDetails = () => {
    if (isPremium && !isCustomer) {
      return {
        title: 'PLAN PREMIUM - PUBLICITA TU EMPRESA',
        description: `
        Este plan premium está diseñado para empresas del sector funerario que buscan visibilidad y más clientes. Beneficios:
        - Mayor exposición en la plataforma.
        - Acceso a estadísticas y métricas de visualización.
        - Publicidad destacada en búsquedas.
        - Soporte prioritario.
        `,
        price: '9.99€/mes',
        borderColor: GlobalStyles.red,
        backgroundColor: GlobalStyles.lightGrey,
      };
    }
    if (!isPremium && !isCustomer) {
      return {
        title: 'PLAN PREMIUM - PUBLICITA TU EMPRESA',
        description: `
        Este plan está diseñado para empresas del sector funerario que buscan visibilidad y más clientes. Beneficios:
        - Mayor exposición en la plataforma.
        - Acceso a estadísticas y métricas de visualización.
        - Publicidad destacada en búsquedas.
        - Soporte prioritario.
        `,
        price: '9.99€/mes',
        borderColor: GlobalStyles.red,
        backgroundColor: GlobalStyles.white,
      };
    }
    if (isPremium && isCustomer) {
      return {
        title: 'PLAN MENSUAL - PROGRAMA TUS MENSAJES DE DESPEDIDA',
        description: `
        Este plan mensual permite programar mensajes personalizados que serán enviados tras la confirmación de tu fallecimiento. Beneficios:
        - Personalización total de mensajes.
        - Envío automatizado tras verificación.
        - Notificación a los destinatarios elegidos.
        - Tranquilidad y seguridad garantizadas.
        `,
        price: '0.99€/mes',
        borderColor: GlobalStyles.blue,
        backgroundColor: GlobalStyles.lightGrey,
      };
    }
    if (!isPremium && isCustomer) {
      return {
        title: 'PLAN MENSUAL - PROGRAMA TUS MENSAJES DE DESPEDIDA',
        description: `
        Este plan mensual permite programar mensajes personalizados que serán enviados tras la confirmación de tu fallecimiento. Beneficios:
        - Personalización total de mensajes.
        - Envío automatizado tras verificación.
        - Notificación a los destinatarios elegidos.
        - Tranquilidad y seguridad garantizadas.
        `,
        price: '0.99€/mes',
        borderColor: GlobalStyles.blue,
        backgroundColor: GlobalStyles.white,
      };
    }
  };

  const { title, description, price, borderColor, backgroundColor } = getPlanDetails() || {};
  
  const esquelasDetails = {
    title: 'ESQUELAS DIGITALES',
    description: `
    Crea y envía esquelas digitales personalizadas cuando lo necesites. Beneficios:
    - Personalización de textos y estilos.
    - Envío instantáneo a contactos seleccionados.
    - Almacenamiento y acceso permanente.
    - Diseño elegante y fácil de compartir.
    `,
    price: '1.99€/esquela',
    borderColor: GlobalStyles.grey,
    backgroundColor: GlobalStyles.lightGrey,
  };

  return (
    <View>
      {/* plan específico según el rol */}
      {title && (
        <View style={[styles.card, { borderColor, backgroundColor }]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.price}>{price}</Text>
          {isPremium ? (
            <TouchableOpacity style={styles.buttonCancel}>
              <Text style={styles.buttonText}>Darte de baja</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.buttonSubscribe}>
              <Text style={styles.buttonText}>Contratar plan</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* esquelas digitales (siempre visible) */}
      <View style={[styles.card, { borderColor: esquelasDetails.borderColor, backgroundColor: esquelasDetails.backgroundColor }]}>
        <Text style={styles.title}>{esquelasDetails.title}</Text>
        <Text style={styles.description}>{esquelasDetails.description}</Text>
        <Text style={styles.price}>{esquelasDetails.price}</Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  darkCard: {
    borderColor: GlobalStyles.grey,
    backgroundColor: GlobalStyles.lightGrey,
  },
  title: {
    fontSize: 18,
    fontFamily: GlobalStyles.fontBold,
    color: GlobalStyles.darkGrey,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontFamily: GlobalStyles.font,
    color: GlobalStyles.grey,
    textAlign: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontFamily: GlobalStyles.fontBold,
    color: GlobalStyles.blue,
  },
  buttonSubscribe: {
    marginTop: 10,
    backgroundColor: GlobalStyles.blue,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonCancel: {
    marginTop: 10,
    backgroundColor: GlobalStyles.red,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: GlobalStyles.white,
    fontFamily: GlobalStyles.fontBold,
  },
});

export default PlanCard;
