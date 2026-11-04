const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://automationexercise.com',
    // Sitio público y lento: un margen mayor al default (4s) en lugar de timeouts sueltos en cada test
    defaultCommandTimeout: 10000,
    chromeWebSecurity: false, // Desactiva seguridad estricta para evitar conflictos de window
    blockHosts: [
      "*googlesyndication.com",
      "*adtrafficequality.google",
      "*://googlesyndication.com"
    ],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})