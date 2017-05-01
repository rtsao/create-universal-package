const babel = require('rollup-plugin-babel');

const plugins = [babel()];
const template = ({env, format}) => `${env}.${format}.js`;
const formats = ['es', 'cjs'];

module.exports = {
  plugins,
  template,
  formats,
};
