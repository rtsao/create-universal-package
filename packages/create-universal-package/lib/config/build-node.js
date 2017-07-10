const babel = require('rollup-plugin-babel');
const {
  template,
  formats,
} = require('./build-shared.js');

const nodeConfig = require('./node-config.js');

module.exports = (userBabelConfig) => ({
  plugins: [babel(nodeConfig(userBabelConfig))],
  template,
  formats,
});
