const path = require('path');
const spawnBuilder = require('./spawn-bundler.js');
const validateConfig = require('./validate-config.js');

module.exports = buildTests;

function buildTests(opts) {
  const babelConfig = validateConfig(opts.dir);
  const dest = path.join(opts.dir, 'dist-tests');
  const node = spawnBuilder({
    env: 'node',
    entry: path.join(opts.dir, '{!(node_modules)/**/__tests__/__node__,!(node_modules)/**/__tests__,__tests__,__tests__/__node__}/*.js'),
    dest,
    config: path.join(__dirname, './config/test-node.js'),
    babelConfig
  });
  const browser = spawnBuilder({
    env: 'browser',
    entry: path.join(opts.dir, '{!(node_modules)/**/__tests__/__browser__,!(node_modules)/**/__tests__,__tests__,__tests__/__browser__}/*.js'),
    dest,
    config: path.join(__dirname, './config/test-browser.js'),
    babelConfig
  });
  return {node, browser};
}
