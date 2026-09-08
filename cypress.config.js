const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
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
});