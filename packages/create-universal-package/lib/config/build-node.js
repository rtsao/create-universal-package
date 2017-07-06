const babel = require('rollup-plugin-babel');
const {
  template,
  formats,
} = require('./build-shared.js');

const nodeConfig = require('./node-config.js');

const plugins = [babel(nodeConfig)];

module.exports = {
  plugins,
  template,
  formats,
};
