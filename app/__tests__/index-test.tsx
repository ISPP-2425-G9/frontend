import React from 'react';
import { render } from '@testing-library/react-native';
import Index from '../index';

// Mock de Redirect
const mockRedirect = jest.fn();
jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: string }) => {
    // Llamamos a la función mock para registrar la propiedad href
    mockRedirect(href);
    // Devolvemos null para simular la redirección
    return null;
  },
}));

describe('Index', () => {
  beforeEach(() => {
    // Limpiar el mock antes de cada prueba
    mockRedirect.mockClear();
  });

  it('should redirect to /home', () => {
    render(<Index />);
    
    // Verificar que se llamó a Redirect con la propiedad href="/home"
    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith('/home');
  });
}); 