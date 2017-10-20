const babel = require('rollup-plugin-babel');
const multiEntry = require('rollup-plugin-multi-entry');
const nodeConfig = require('./node-config.js');

const template = ({env}) => `${env}.js`;

module.exports = (userBabelConfig) => ({
  formats: ['cjs'],
  template,
  plugins: [multiEntry(), babel(nodeConfig(userBabelConfig))],
});
