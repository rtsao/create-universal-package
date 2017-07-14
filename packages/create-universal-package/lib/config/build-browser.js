const babel = require('rollup-plugin-babel');
const {
  template,
  formats
} = require('./build-shared.js');

const browserConfig = require('./browser-config.js');

module.exports = (userBabelConfig, esEdition) => ({
  plugins: [babel(browserConfig(userBabelConfig, esEdition))],
  template,
  formats,
});
