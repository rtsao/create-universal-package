const rollup = require('rollup');
const babel = require('../rollup-plugin-babel');
const multiEntry = require('rollup-plugin-multi-entry');

module.exports = async function build(
  inputOptions,
  babelConfig,
  outputs,
  testMode,
) {
  inputOptions.plugins = [babel(babelConfig)];

  if (testMode === 'node') {
    inputOptions.plugins.push(multiEntry());
  }

  const bundle = await rollup.rollup(inputOptions);

  await Promise.all(outputs.map(outputOptions => bundle.write(outputOptions)));
};
