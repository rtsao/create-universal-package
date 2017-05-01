const babel = require('rollup-plugin-babel');
const multiEntry = require('rollup-plugin-multi-entry');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const alias = require('rollup-plugin-alias');
const replace = require('rollup-plugin-replace');

const template = ({env}) => `${env}.js`;

module.exports = {
  formats: ['iife'],
  template,
  plugins: [
    alias({
      // This is needed because tape expects node built-in shims
      tape: require.resolve('tape-rollup'),
      // TODO: replace tape entirely from unitest stack
    }),
    resolve({browser: true}),
    commonjs({include: 'node_modules/**'}),
    multiEntry({exports: false}),
    babel({exclude: 'node_modules/**'}),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
