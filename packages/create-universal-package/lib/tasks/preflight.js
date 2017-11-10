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
  assert.strictEqual(pkg.main, './dist/node.cjs.js');
  assert.strictEqual(pkg.module, './dist/node.es.js');
  assert.deepStrictEqual(pkg.browser, {
    './dist/node.cjs.js': './dist/browser.es5.cjs.js',
    './dist/node.es.js': './dist/browser.es5.es.js',
  });
  assert.deepStrictEqual(pkg.es2015, {
    './dist/browser.es5.cjs.js': './dist/browser.es2015.cjs.js',
    './dist/browser.es5.es.js': './dist/browser.es2015.es.js',
  });
  assert.deepStrictEqual(pkg.es2017, {
    './dist/browser.es5.cjs.js': './dist/browser.es2017.cjs.js',
    './dist/browser.es5.es.js': './dist/browser.es2017.es.js',
    './dist/browser.es2015.cjs.js': './dist/browser.es2017.cjs.js',
    './dist/browser.es2015.es.js': './dist/browser.es2017.es.js',
  });
  assert.ok(
    pkg.files && pkg.files.includes('dist'),
    '"dist" not found in package.json "files" field',
  );
}
