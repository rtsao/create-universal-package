const path = require('path');
const spawnBuilder = require('./spawn-bundler.js');

module.exports = buildTests;

function buildTests(opts) {
  const entry = path.join(opts.dir, '{!(node_modules)/**/__tests__,__tests__}/*.js');
  const dest = path.join(opts.dir, 'dist-tests');
  const node = spawnBuilder({
    env: 'node',
    entry,
    dest,
    config: path.join(__dirname, './config/test-node.js'),
  });
  const browser = spawnBuilder({
    env: 'browser',
    entry,
    dest,
    // TODO: replace with `config-test-browser` when not unitest no longer uses electron
    config: path.join(__dirname, './config/test-browser.js'),
  });
  return {node, browser};
}
