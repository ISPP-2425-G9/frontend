// Import commands.js using ES2015 syntax:
import './commands'


// Prevent TypeScript errors when accessing the "cy" object in your test files
declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom commands here if needed
    }
  }
} 