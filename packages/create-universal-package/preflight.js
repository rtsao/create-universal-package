// @flow

const fs = require('fs');
const {promisify} = require('util');
const assert = require('assert');

const readFile = promisify(fs.readFile);

module.exports = async function preflight(filePath /*: string */) {
  const contents = await readFile(filePath, {encoding: 'utf8'});
  const pkg = JSON.parse(contents);
  try {
    assertPkgField(pkg, 'main', './dist-node-cjs/index.js');
    assertPkgField(pkg, 'module', './dist-node-esm/index.js');
    assertPkgField(pkg, 'browser', {
      './dist-node-cjs/index.js': './dist-browser-cjs/index.js',
      './dist-node-esm/index.js': './dist-browser-esm/index.js',
    });
  } catch (err) {
    throw err;
  }
};

function assertPkgField(pkg, field, expected) {
  try {
    assert.deepEqual(pkg[field], expected);
  } catch (err) {
    throw new Error(
      `package.json "${field}" entry incorrect, expected value: ${JSON.stringify(
        expected,
        null,
        '  ',
      )}`,
    );
  }
}
