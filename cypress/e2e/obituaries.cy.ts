/// <reference types="cypress" />

describe('Obituarios', () => {
  beforeEach(() => {
    // Visitar la página de obituarios antes de cada test
    cy.visit('/obituaries', { failOnStatusCode: false });
  });

  it('debería mostrar la lista de obituarios', () => {
    // Verificar que la página de obituarios se carga correctamente
    cy.get('[data-testid="obituary-page-title"]').should('contain', 'Esquelas');
    
    // Verificar que hay una lista de obituarios
    cy.get('[data-testid="obituary-list"]').should('exist');
  });

  it('debería permitir crear un nuevo obituario', () => {
    // Hacer clic en el botón de crear obituario
    cy.get('[data-testid="create-obituary-button"]').click();
    
    // Verificar que se redirige a la página de creación de obituarios
    cy.url().should('include', '/obituaries/createObituary');
    
    // Verificar que el formulario de creación está presente
    cy.get('[data-testid="obituary-form"]').should('exist');
  });

  it('debería mostrar los detalles de un obituario al hacer clic en él', () => {
    // Hacer clic en el primer obituario de la lista
    cy.get('[data-testid="obituary-item"]').first().click();
    
    // Verificar que se redirige a la página de detalles del obituario
    cy.url().should('include', '/obituaries/');
    
    // Verificar que se muestran los detalles del obituario
    cy.get('[data-testid="obituary-details"]').should('exist');
  });
});