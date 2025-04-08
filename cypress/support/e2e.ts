// Import commands.js using ES2015 syntax:
import './commands'
import '@cypress/code-coverage/support'


// Prevent TypeScript errors when accessing the "cy" object in your test files
declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom commands here if needed
    }
  }
}

// Hide fetch/XHR requests from the command log
const app = window as any;
const originalConsoleLog = app.console.log;
app.console.log = (...args: any[]) => {
  if (args[0]?.includes?.('fetch') || args[0]?.includes?.('XHR')) {
    return;
  }
  return originalConsoleLog.apply(app.console, args);
}; 