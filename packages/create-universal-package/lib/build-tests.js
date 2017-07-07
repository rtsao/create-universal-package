const path = require('path');
const spawnBuilder = require('./spawn-bundler.js');

module.exports = buildTests;

function buildTests(opts) {
  const dest = path.join(opts.dir, 'dist-tests');
  const node = spawnBuilder({
    env: 'node',
    entry: path.join(opts.dir, '{!(node_modules)/**/__tests__/__node__,!(node_modules)/**/__tests__,__tests__,__tests__/__node__}/*.js'),
    dest,
    config: path.join(__dirname, './config/test-node.js'),
  });
  const browser = spawnBuilder({
    env: 'browser',
    entry: path.join(opts.dir, '{!(node_modules)/**/__tests__/__browser__,!(node_modules)/**/__tests__,__tests__,__tests__/__browser__}/*.js'),
    dest,
    // TODO: replace with `config-test-browser` when not unitest no longer uses electron
    config: path.join(__dirname, './config/test-browser.js'),
  });
  return {node, browser};
}
