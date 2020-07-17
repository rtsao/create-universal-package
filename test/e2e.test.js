/* global test */

const t = require('assert');
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const {promisify} = require('util');
const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;
const glob = require('tiny-glob');

const execFile = promisify(cp.execFile);
const readFile = filename => promisify(fs.readFile)(filename, 'utf-8');

const fixture = path.resolve(__dirname, '../fixture-package');

test('builds', async () => {
  try {
    await execFile('yarn', ['build'], {cwd: fixture});
  } catch (err) {
    console.log(err);
  }

  const files = await glob('src/**/*.js', {cwd: fixture});

  t.deepEqual(files, [
    'src/browser.js',
    'src/foo/a.js',
    'src/foo/b.js',
    'src/index.js',
    'src/node.js',
  ]);

  const relative = files.map(file => path.relative('src', file));

  ['dist-browser-esm', 'dist-node-cjs', 'dist-browser-esm'].forEach(base => {
    const artifacts = relative.map(file => path.join(fixture, base, file));

    artifacts.forEach(file => {
      t.equal(fs.existsSync(file), true);
    });
  });
});

test('node build', async () => {
  const contents = await readFile(path.join(fixture, 'dist-node-esm/index.js'));

  const imports = extractImports(contents);
  t.deepEqual(imports, [
    {specifiers: [{default: 'React'}], source: 'react'},
    {specifiers: ['node'], source: './node.js'},
  ]);
});

test('browser build', async () => {
  const contents = await readFile(
    path.join(fixture, 'dist-browser-esm/index.js'),
  );

  const imports = extractImports(contents);
  t.deepEqual(imports, [
    {specifiers: [{default: 'React'}], source: 'react'},
    {specifiers: ['browser'], source: './browser.js'},
  ]);
});

function extractImports(code) {
  const ast = babel.parse(code);
  const imports = [];
  traverse(ast, {
    ImportDeclaration(path) {
      imports.push({
        specifiers: path.node.specifiers.map(specifierDescription),
        source: path.node.source.value,
      });
    },
  });
  return imports;
}

function specifierDescription(node) {
  if (node.type === 'ImportDefaultSpecifier') {
    return {default: node.local.name};
  } else {
    if (node.imported.name !== node.local.name) {
      return {name: node.imported.name, as: node.local.name};
    }
    return node.local.name;
  }
}

test('non-zero status code if syntax error', async () => {
  const errorFilePath = path.join(fixture, 'src/syntax-error.js');
  fs.writeFileSync(errorFilePath, 'let foo = %%%%;');
  try {
    await execFile('yarn', ['build'], {cwd: fixture});
    t.fail('Should error');
  } catch (err) {
    t.ok(err.toString().includes('Unexpected token'));
  } finally {
    fs.unlinkSync(errorFilePath);
  }
});
