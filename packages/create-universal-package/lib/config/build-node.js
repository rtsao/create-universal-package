const babel = require('rollup-plugin-babel');
const {
  getBabelConfig,
  template,
  formats,
} = require('./build-shared');

const plugins = [babel(getBabelConfig('node', [6]))];

module.exports = {
  plugins,
  template,
  formats,
};
