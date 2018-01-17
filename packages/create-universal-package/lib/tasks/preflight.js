const fs = require('fs');
const assert = require('assert');
const {promisify} = require('util');

const readFileAsync = promisify(fs.readFile);

module.exports = async function preflight(filePath, flow) {
  const contents = await readFileAsync(filePath, {encoding: 'utf8'});
  const pkg = JSON.parse(contents);
  validateFields(pkg, flow);
};

function assertPkgField(pkg, field, fixture) {
  assert.deepStrictEqual(
    pkg[field],
    fixture,
    `package "${field}" definition incorrect, expected: ${JSON.stringify(
      fixture,
      null,
      '  ',
    )}`,
  );
}

function validateFields(pkg, flow) {
  assert.strictEqual(pkg.main, './dist/index.js');
  assert.strictEqual(pkg.module, './dist/index.es.js');
  assertPkgField(pkg, 'browser', {
    './dist/index.js': './dist/browser.es5.js',
    './dist/index.es.js': './dist/browser.es5.es.js',
  });
  assertPkgField(pkg, 'es2015', {
    './dist/browser.es5.es.js': './dist/browser.es2015.es.js',
  });
  assertPkgField(pkg, 'es2017', {
    './dist/browser.es5.es.js': './dist/browser.es2017.es.js',
    './dist/browser.es2015.es.js': './dist/browser.es2017.es.js',
  });
  assert.ok(
    pkg.files && pkg.files.includes('dist'),
    '"dist" not found in package.json "files" field',
  );
  if (flow) {
    assert.ok(
      pkg.files && pkg.files.includes('src'),
      '"src" not found in package.json "files" field',
    );
  }
}
