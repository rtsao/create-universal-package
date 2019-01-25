const glob = require('tiny-glob');
const del = require('eliminate');

module.exports = async function clean(opts = {}) {
  const dirs = await glob('dist-*', {absolute: true, cwd: opts.dir});
  return Promise.all(dirs.map(dirpath => del(dirpath)));
};
