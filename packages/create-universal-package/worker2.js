// @flow

const fs = require('fs');
const {promisify} = require('util');
const babel = require('@babel/core');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function build(filepath) {
  const fileContents = readFile(filepath, 'utf8');

  const babelOpts = {
    ...babel.loadPartialConfig,
    sourceMaps: 'inline',
  };

  const ast = babel.parseSync(await fileContents, babelOpts);

  const browserResult = babel.transformFromAstSync(ast, source, babelOpts);
  const nodeResult = babel.transformFromAstSync(ast, source, babelOpts);
  const nodeResultESM = babel.transformFromAstSync(ast, source, babelOpts);

  return Promise.all([
    writeFile(`dist-browser-esm/${filepath}`, browserResult.code),
    writeFile(`dist-node-cjs/${filepath}`, nodeResult.code),
    writeFile(`dist-node-esm/${filepath}`, nodeResult.code),
  ]);
}

exports.build = build;
