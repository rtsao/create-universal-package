const babel = require('rollup-plugin-babel');
const {
  template,
  formats,
} = require('./build-shared.js');

const browserConfig = require('./browser-config.js');

module.exports = (userBabelConfig) => ({
  plugins: [babel(browserConfig(userBabelConfig))],
  template,
  formats,
});
