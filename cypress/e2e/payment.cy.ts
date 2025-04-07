/// <reference types="cypress" />

describe('Proceso de pago', () => {
  beforeEach(() => {
    // Visitar la página de creación de obituarios antes de cada test
    cy.visit('/obituaries/create');
  });

  it('debería mostrar el modal de pago al hacer clic en el botón de pago', () => {
    // Rellenar el formulario con datos básicos
    cy.get('[data-testid="name-input"]').type('Juan Pérez');
    cy.get('[data-testid="date-of-birth-input"]').type('1950-01-01');
    cy.get('[data-testid="date-of-death-input"]').type('2023-01-01');
    
    // Hacer clic en el botón de pago
    cy.get('[data-testid="pay-button"]').click();
    
    // Verificar que se muestra el modal de pago
    cy.get('[data-testid="payment-modal"]').should('be.visible');
  });

  it('debería procesar el pago correctamente', () => {
    // Rellenar el formulario con datos básicos
    cy.get('[data-testid="name-input"]').type('Juan Pérez');
    cy.get('[data-testid="date-of-birth-input"]').type('1950-01-01');
    cy.get('[data-testid="date-of-death-input"]').type('2023-01-01');
    
    // Hacer clic en el botón de pago
    cy.get('[data-testid="pay-button"]').click();
    
    // Verificar que se muestra el modal de pago
    cy.get('[data-testid="payment-modal"]').should('be.visible');
    
    // Simular un pago exitoso (esto dependerá de cómo esté implementado el componente de pago)
    // Por ejemplo, si hay un botón de "pagar" dentro del modal:
    cy.get('[data-testid="process-payment-button"]').click();
    
    // Verificar que el pago se procesó correctamente
    // Esto podría ser verificar que se muestra un mensaje de éxito o que se redirige a otra página
    cy.get('[data-testid="payment-success-message"]').should('be.visible');
    
    // Verificar que el obituario se creó correctamente
    cy.url().should('include', '/obituaries/');
  });

  it('debería manejar errores de pago correctamente', () => {
    // Rellenar el formulario con datos básicos
    cy.get('[data-testid="name-input"]').type('Juan Pérez');
    cy.get('[data-testid="date-of-birth-input"]').type('1950-01-01');
    cy.get('[data-testid="date-of-death-input"]').type('2023-01-01');
    
    // Hacer clic en el botón de pago
    cy.get('[data-testid="pay-button"]').click();
    
    // Verificar que se muestra el modal de pago
    cy.get('[data-testid="payment-modal"]').should('be.visible');
    
    // Simular un error de pago (esto dependerá de cómo esté implementado el componente de pago)
    // Por ejemplo, si hay un botón para simular un error:
    cy.get('[data-testid="simulate-payment-error"]').click();
    
    // Verificar que se muestra un mensaje de error
    cy.get('[data-testid="payment-error-message"]').should('be.visible');
    
    // Verificar que el modal de pago sigue abierto
    cy.get('[data-testid="payment-modal"]').should('be.visible');
  });
});