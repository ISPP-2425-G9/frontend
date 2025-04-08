import { defineConfig } from 'cypress'
import webpackConfig from './webpack.config.js'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8081/',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      on('task', {
        coverage: () => {
          return null
        }
      });
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      webpackConfig,
    },
    supportFile: 'cypress/support/component.ts',
    indexHtmlFile: 'cypress/support/component-index.html',
    setupNodeEvents(on, config) {
      on('task', {
        coverage: () => {
          return null
        }
      });
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
  },
  video: false,
  screenshotOnRunFailure: false,
})