// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
const app = window.top;
if (app) {
  // @ts-ignore
  app.console.log = () => {};
}

// Prevent TypeScript errors when accessing the "cy" object in your test files
declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom commands here
      mount: typeof mount;
    }
  }
}

// Import mount from @cypress/react
import { mount } from 'cypress/react';

// Add mount command to Cypress
Cypress.Commands.add('mount', mount); 