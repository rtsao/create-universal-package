const babel = require('rollup-plugin-babel');
const multiEntry = require('rollup-plugin-multi-entry');
const resolve = require('rollup-plugin-node-resolve');
const nodeConfig = require('./node-config.js');

const template = ({env}) => `${env}.js`;

module.exports = {
  formats: ['cjs'],
  template,
  plugins: [multiEntry(), babel(nodeConfig)],
};
