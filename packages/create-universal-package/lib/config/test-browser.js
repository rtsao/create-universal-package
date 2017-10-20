const babel = require('rollup-plugin-babel');
const multiEntry = require('rollup-plugin-multi-entry');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const browserConfig = require('./browser-config.js');

const template = ({env}) => `${env}.js`;

module.exports = (userBabelConfig) => ({
  formats: ['iife'],
  template,
  plugins: [
    resolve({browser: true}),
    commonjs({include: 'node_modules/**'}),
    multiEntry({exports: false}),
    babel(Object.assign({}, browserConfig(userBabelConfig), {exclude: 'node_modules/**'})),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
});
