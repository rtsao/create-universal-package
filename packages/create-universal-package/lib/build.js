const path = require('path');
const spawnBuilder = require('./spawn-bundler.js');

module.exports = build;

function build(opts) {
  const node = spawnBuilder({
    env: 'node',
    entry: path.join(opts.dir, 'src/index.js'),
    dest: path.join(opts.dir, 'dist')
  });
  const browser = spawnBuilder({
    env: 'browser',
    entry: path.join(opts.dir, 'src/index.js'),
    dest: path.join(opts.dir, 'dist')
  });
  return {node, browser};
}
