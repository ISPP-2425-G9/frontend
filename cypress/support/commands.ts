/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// Declarar los tipos para los comandos personalizados
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      createObituary(obituaryData: any): Chainable<void>;
      selectPaymentMethod(method: string): Chainable<void>;
    }
  }
}

// Comando para iniciar sesión
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-cy=email-input]').type(email);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-button]').click();
  cy.url().should('not.include', '/login');
});

// Comando para crear un obituario
Cypress.Commands.add('createObituary', (obituaryData: any) => {
  cy.visit('/obituaries/create');
  
  // Rellenar el formulario con los datos proporcionados
  if (obituaryData.name) {
    cy.get('[data-testid="name-input"]').type(obituaryData.name);
  }
  
  if (obituaryData.dateOfBirth) {
    cy.get('[data-testid="date-of-birth-input"]').type(obituaryData.dateOfBirth);
  }
  
  if (obituaryData.dateOfDeath) {
    cy.get('[data-testid="date-of-death-input"]').type(obituaryData.dateOfDeath);
  }
  
  if (obituaryData.description) {
    cy.get('[data-testid="description-input"]').type(obituaryData.description);
  }
  
  // Enviar el formulario
  cy.get('[data-testid="submit-button"]').click();
  
  // Verificar que se ha creado correctamente
  cy.url().should('include', '/obituaries/');
});

// Comando para seleccionar un método de pago
Cypress.Commands.add('selectPaymentMethod', (method: string) => {
  cy.get('[data-cy=payment-method-select]').select(method);
});