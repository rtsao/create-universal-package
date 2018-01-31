const {promisify} = require('util');
const rimraf = promisify(require('rimraf'));
const path = require('path');

module.exports = function clean(opts) {
  const dist = path.join(opts.dir, 'dist/');
  const distTest = path.join(opts.dir, 'dist-tests/');
  return Promise.all([
    rimraf(dist, {disableGlob: true}),
    rimraf(distTest, {disableGlob: true}),
  ]);
};
