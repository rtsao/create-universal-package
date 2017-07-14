const fs = require('fs');
const assert = require('assert');

/**
 * Ensure correct 'main', 'module', and 'browser' package.json fields
 */
function preflight(pkgPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(pkgPath, (err, data) => {
      if (err) {
        reject(err);
      }
      const pkg = JSON.parse(data);
      try {
        validateFields(pkg);
      } catch (e) {
        reject(e);
      }
      resolve();
    });
  });
}

module.exports = preflight;

function validateFields(pkg) {
  assert.strictEqual(pkg.main, './dist/node.cjs.js');
  assert.strictEqual(pkg.module, './dist/node.es.js');
  assert.deepStrictEqual(pkg.browser, {
    './dist/node.cjs.js': './dist/browser.cjs.js',
    './dist/node.es.js': './dist/browser.es.js',
  });
  assert.deepStrictEqual(pkg.es2015, {
    './dist/node.cjs.js': './dist/node.cjs.es2015.js',
    './dist/node.es.js': './dist/node.es.es2015.js',
    './dist/browser.cjs.js': './dist/browser.cjs.es2015.js',
    './dist/browser.es.js': './dist/browser.es.es2015.js'
  });
}
