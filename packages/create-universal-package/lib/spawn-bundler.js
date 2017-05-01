const {fork} = require('child_process');
const {join} = require('path');

module.exports = spawnBuilder;

function spawnBuilder({env, entry, dest, config}) {
  const builder = fork(
    join(__dirname, 'child-bundler.js'),
    [env, entry, dest, config],
    {silent: true}
  );
  return builder;
}
