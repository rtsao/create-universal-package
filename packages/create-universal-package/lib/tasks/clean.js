const cp = require('child_process');
const {promisify} = require('util');
const exec = promisify(cp.exec);
const path = require('path');

module.exports = function clean(opts) {
  return Promise.all([
    exec(`rm -rf ${path.join(opts.dir, 'dist-tests/')}`),
    exec(`rm -rf ${path.join(opts.dir, 'dist/')}`),
  ]);
};
