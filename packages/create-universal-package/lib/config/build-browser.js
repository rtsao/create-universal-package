const babel = require('rollup-plugin-babel');
const {
  template,
  formats,
} = require('./build-shared.js');

const browserConfig = require('./browser-config.js');

const plugins = [babel(browserConfig)];

module.exports = {
  plugins,
  template,
  formats,
};
