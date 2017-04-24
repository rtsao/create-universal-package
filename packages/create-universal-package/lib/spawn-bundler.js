const {fork} = require('child_process');
const {join} = require('path');

module.exports = spawnBuilder;

function spawnBuilder({env, entry, dest}) {
  const builder = fork(
    join(__dirname, 'child-bundler.js'),
    [env, entry, dest],
    {silent: true}
  );
  return builder;
}
