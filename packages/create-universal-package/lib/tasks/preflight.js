const fs = require('fs');
const assert = require('assert');
const {promisify} = require('util');

const readFileAsync = promisify(fs.readFile);

module.exports = async function preflight(filePath) {
  const contents = await readFileAsync(filePath, {encoding: 'utf8'});
  const pkg = JSON.parse(contents);
  validateFields(pkg);
};

function validateFields(pkg) {
  assert.strictEqual(pkg.main, './dist/index');
  assert.strictEqual(pkg.module, './dist/index.mjs');
  assert.deepStrictEqual(pkg.browser, {
    './dist/index.js': './dist/browser.es5.js',
    './dist/index.mjs': './dist/browser.es5.mjs',
  });
  assert.deepStrictEqual(pkg.es2015, {
    './dist/browser.es5.mjs': './dist/browser.es2015.mjs',
  });
  assert.deepStrictEqual(pkg.es2017, {
    './dist/browser.es5.mjs': './dist/browser.es2017.mjs',
    './dist/browser.es2015.mjs': './dist/browser.es2017.mjs',
  });
  assert.ok(
    pkg.files && pkg.files.includes('dist'),
    '"dist" not found in package.json "files" field',
  );
}
