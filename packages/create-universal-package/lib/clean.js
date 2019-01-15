const fs = require('fs-extra');
const glob = require('tiny-glob');

module.exports = async function clean(opts = {}) {
  const dirs = await glob('dist-*', {absolute: true, cwd: opts.dir});
  return Promise.all(dirs.map(async dirpath => fs.remove(dirpath)));
};
