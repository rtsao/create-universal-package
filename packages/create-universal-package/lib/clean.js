const path = require('path');
const rimraf = require('rimraf');

module.exports = clean;

function clean(opts) {
  const dist = path.join(opts.dir, 'dist/');
  const distTest = path.join(opts.dir, 'dist-tests/');
  rimraf(dist, {disableGlob: true}, () => {});
  rimraf(distTest, {disableGlob: true},  () => {});
}
