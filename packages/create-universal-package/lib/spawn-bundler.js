const {fork} = require('child_process');
const {join} = require('path');

module.exports = spawnBuilder;

function spawnBuilder({env, entry, dest, config, babelConfig = {}, moduleName, globals}) {
  const builder = fork(
    join(__dirname, 'child-bundler.js'),
    [env, entry, dest, config, JSON.stringify(babelConfig), moduleName, globals],
    {silent: true}
  );
  return builder;
}
