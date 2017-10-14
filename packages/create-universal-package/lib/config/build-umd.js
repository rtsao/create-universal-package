const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const resolve = require('rollup-plugin-node-resolve');

const browserConfig = require('./browser-config.js');

module.exports = (userBabelConfig, includeExternals, performUglify) => {
  const plugins = [babel(browserConfig(userBabelConfig))];
  if (includeExternals) {
    plugins.push(resolve({
      browser: true,
    }));
  }
  if (performUglify) {
    plugins.push(uglify());
  }

  const template = `umd${includeExternals ? '.full' : ''}${performUglify ? '.min': ''}.js`;

  return {
    plugins,
    template,
  };
};
