/* global test */

const t = require('assert');
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const {promisify} = require('util');
const glob = require('tiny-glob');

const execFile = promisify(cp.execFile);
const readFile = promisify(fs.readFile);

const fixture = path.resolve(__dirname, '../fixture-package-preset-env');

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

test('node esm build has imports and exports', async () => {
  for (const file of ['browser.js', 'index.js', 'node.js']) {
    const contents = await readFile(path.join(fixture, 'dist-node-esm', file));
    // No commonjs transformations
    t.equal(contents.indexOf('__esModule'), -1);
  }
});

test('browser esm build has imports and exports', async () => {
  for (const file of ['browser.js', 'index.js', 'node.js']) {
    const contents = await readFile(
      path.join(fixture, 'dist-browser-esm', file),
    );
    // No commonjs transformations
    t.equal(contents.indexOf('__esModule'), -1);
  }
});
