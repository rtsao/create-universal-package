// @flow

const fs = require('fs');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);

module.exports = async function preflight(filePath /*: string */) {
  const contents = await readFile(filePath, {encoding: 'utf8'});
  const pkg = JSON.parse(contents);
  try {
    assertPkgField(pkg, 'main', './dist-node-cjs/index.js');
    assertPkgField(pkg, 'module', './dist-node-esm/index.js');
    assertPkgField(pkg, 'browser', './dist-browser-esm/index.js');
  } catch (err) {
    throw err;
  }
};

function assertPkgField(pkg, field, expected) {
  if (pkg[field] !== expected) {
    throw new Error(
      `package "${field}" definition incorrect, expected: ${JSON.stringify(
        expected,
        null,
        '  ',
      )}`,
    );
  }
}
