const path = require('path');
const babel = require('rollup-plugin-babel');
const spawnBuilder = require('./spawn-bundler.js');
const validateConfig = require('./validate-config.js');

module.exports = build;

function build(opts) {
  const babelConfig = validateConfig(opts.dir);
  const entry = path.join(opts.dir, 'src/index.js');
  const dest = path.join(opts.dir, 'dist');
  const node = spawnBuilder({
    env: 'node',
    entry,
    dest,
    config: path.join(__dirname, './config/build-node.js'),
    babelConfig
  });
  const browser = spawnBuilder({
    env: 'browser',
    entry,
    dest,
    config: path.join(__dirname, './config/build-browser.js'),
    babelConfig
  });
  return {node, browser};
}
