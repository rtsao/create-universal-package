const babel = require('rollup-plugin-babel');
const {
  getBabelConfig,
  template,
  formats,
} = require('./build-shared');

const plugins = [babel(getBabelConfig('browser', {ie: [9]}))];

module.exports = {
  plugins,
  template,
  formats,
};
