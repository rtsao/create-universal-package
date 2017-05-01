const path = require('path');
const babel = require('rollup-plugin-babel');
const spawnBuilder = require('./spawn-bundler.js');

module.exports = build;

function build(opts) {
  const entry = path.join(opts.dir, 'src/index.js');
  const dest = path.join(opts.dir, 'dist');
  const config = path.join(__dirname, './config/build.js');
  const node = spawnBuilder({
    env: 'node',
    entry,
    dest,
    config,
  });
  const browser = spawnBuilder({
    env: 'browser',
    entry,
    dest,
    config,
  });
  return {node, browser};
}
