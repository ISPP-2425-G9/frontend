import React from 'react';
import { render } from '@testing-library/react-native';
import TermsAndConditions from '../TermsAndConditions'; // Cambia esta ruta si es necesario
import LineBreak from "../LineBreack";


describe('TermsAndConditions', () => {
  test('should render the component correctly', () => {
    const { getByText } = render(<TermsAndConditions />);

    expect(getByText('1. Aviso legal')).toBeTruthy();
    expect(getByText('2. Condiciones de acceso al sitio web y accesibilidad')).toBeTruthy();
    expect(getByText('3. Exoneración de responsabilidad')).toBeTruthy();
    expect(getByText('4. Propiedad intelectual')).toBeTruthy();
    expect(getByText('5. LSSICE. Ley de Servicios de la Sociedad de la Información y Comercio Electrónico')).toBeTruthy();
    expect(getByText('6. Objeto de la web')).toBeTruthy();
    expect(getByText('7. Términos de uso')).toBeTruthy();
    expect(getByText('7.1. Aceptación de los términos de uso')).toBeTruthy();
    expect(getByText('7.2. Uso del sitio web')).toBeTruthy();
    expect(getByText('7.2.1. Registro de Usuario')).toBeTruthy();
    expect(getByText('7.2.2. Tipos de Usuario')).toBeTruthy();
    expect(getByText('7.2.3. Gestión de Planes y Suscripciones')).toBeTruthy();
    expect(getByText('7.2.4. Creación y Personalización de Esquelas y Mensajes')).toBeTruthy();
    expect(getByText('7.2.5. Validación del Fallecimiento')).toBeTruthy();
    expect(getByText('7.2.6. Distribución Digital de Esquelas y Mensajes')).toBeTruthy();
    expect(getByText('7.2.7. Gestión de Contactos de Emergencia')).toBeTruthy();
    expect(getByText('7.2.8. Accesibilidad y Usabilidad')).toBeTruthy();
    expect(getByText('7.2.9. Gestión de Servicios Externos')).toBeTruthy();
    expect(getByText('7.3. Restricciones de uso')).toBeTruthy();
    expect(getByText('8. Política de privacidad')).toBeTruthy();
    expect(getByText('8.1. Información que recopilamos')).toBeTruthy();
    expect(getByText('8.2. Uso de la información')).toBeTruthy();
    expect(getByText('8.3. Declaración de confidencialidad')).toBeTruthy();
    expect(getByText('8.4. Protección de la información post-mortem')).toBeTruthy();
    expect(getByText('8.5. Seguridad de los datos')).toBeTruthy();
    expect(getByText('8.6. Conservación de datos')).toBeTruthy();
    expect(getByText('8.7. Derechos de los usuarios')).toBeTruthy();
    expect(getByText('9. Sistema de pagos')).toBeTruthy();
    expect(getByText('9.1. Métodos de pago')).toBeTruthy();
    expect(getByText('9.2. Seguridad de pagos')).toBeTruthy();
    expect(getByText('9.3. Política de reembolso')).toBeTruthy();
    expect(getByText('9.4. Condiciones de cancelación de servicios')).toBeTruthy();
    expect(getByText('10. Supervisión de contenido')).toBeTruthy();
    expect(getByText('10.1. Supervisión de esquelas y mensajes')).toBeTruthy();
    expect(getByText('10.2. Responsabilidad del usuario')).toBeTruthy();
    expect(getByText('11. Responsabilidades y obligaciones')).toBeTruthy();
    expect(getByText('11.1. Usuarios con plan')).toBeTruthy();
    expect(getByText('11.2. Administradores')).toBeTruthy();
    expect(getByText('12. Legislación aplicable y resolución de conflictos')).toBeTruthy();
  });

  test('should render LineBreak component properly', () => {
    const { getAllByTestId } = render(<TermsAndConditions />);
    const lineBreaks = getAllByTestId('line-break');
    expect(lineBreaks.length).toBeGreaterThan(0);
    
  });
});
