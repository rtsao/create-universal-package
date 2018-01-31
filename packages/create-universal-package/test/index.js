const path = require('path');
const tape = require('tape');
const {promisify} = require('util');
const cp = require('child_process');
const fs = require('fs');
const exec = promisify(cp.exec);

tape('fixture package transpile', async t => {
  const dir = path.join(__dirname, '../../fixture-package/');
  await exec(`yarn clean`, {cwd: dir});
  await exec(`yarn build`, {cwd: dir});
  const expectedFiles = [
    'browser.es2015.es.js',
    'browser.es2017.es.js',
    'browser.es5.es.js',
    'browser.es5.js',
    'index.es.js',
    'index.js',
    'index.js.map',
    'browser.es2015.es.js.map',
    'browser.es2017.es.js.map',
    'browser.es5.es.js.map',
    'browser.es5.js.map',
    'index.es.js.map',
    'index.js.flow',
  ];
  expectedFiles
    .map(file => path.join(dir, 'dist', file))
    .forEach((file, index) => {
      t.ok(fs.existsSync(file), `${expectedFiles[index]} exists`);
    });
  t.end();
});

tape('fixture package build-tests', async t => {
  const dir = path.join(__dirname, '../../fixture-package/');
  await exec(`yarn clean`, {cwd: dir});
  await exec(`yarn pretest`, {cwd: dir});
  const expectedFiles = ['browser.js', 'node.js', 'node.js.map'];
  expectedFiles
    .map(file => path.join(dir, 'dist-tests', file))
    .forEach((file, index) => {
      t.ok(fs.existsSync(file), `${expectedFiles[index]} exists`);
    });
  t.end();
});

tape('fixture package build-tests --skip-browser', async t => {
  const dir = path.join(__dirname, '../../fixture-package/');
  await exec(`yarn clean`, {cwd: dir});
  await exec(`yarn pretest --skip-browser`, {cwd: dir});
  const expectedFiles = ['node.js', 'node.js.map'];
  const nonExpectedFiles = ['browser.js'];
  expectedFiles
    .map(file => path.join(dir, 'dist-tests', file))
    .forEach((file, index) => {
      t.ok(fs.existsSync(file), `${expectedFiles[index]} exists`);
    });

  nonExpectedFiles
    .map(file => path.join(dir, 'dist-tests', file))
    .forEach((file, index) => {
      t.notok(fs.existsSync(file), `${nonExpectedFiles[index]} does not exist`);
    });
  t.end();
});

tape('fixture package build-tests --skip-node', async t => {
  const dir = path.join(__dirname, '../../fixture-package/');
  await exec(`yarn clean`, {cwd: dir});
  await exec(`yarn pretest --skip-node`, {cwd: dir});
  const expectedFiles = ['browser.js'];
  const nonExpectedFiles = ['node.js', 'node.js.map'];
  expectedFiles
    .map(file => path.join(dir, 'dist-tests', file))
    .forEach((file, index) => {
      t.ok(fs.existsSync(file), `${expectedFiles[index]} exists`);
    });

  nonExpectedFiles
    .map(file => path.join(dir, 'dist-tests', file))
    .forEach((file, index) => {
      t.notok(fs.existsSync(file), `${nonExpectedFiles[index]} does not exist`);
    });
  t.end();
});

tape('fixture package separate indexes transpile', async t => {
  const dir = path.join(__dirname, '../../fixture-package-separate-indexes/');
  await exec(`yarn clean`, {cwd: dir});
  await exec(`yarn build`, {cwd: dir});
  const expectedFiles = [
    'browser.es2015.es.js',
    'browser.es2017.es.js',
    'browser.es5.es.js',
    'browser.es5.js',
    'index.es.js',
    'index.js',
    'index.js.map',
    'browser.es2015.es.js.map',
    'browser.es2017.es.js.map',
    'browser.es5.es.js.map',
    'browser.es5.js.map',
    'index.es.js.map',
  ];
  expectedFiles
    .map(file => path.join(dir, 'dist', file))
    .forEach((file, index) => {
      t.ok(fs.existsSync(file), `${expectedFiles[index]} exists`);
    });

  t.notok(
    fs.existsSync(path.join(dir, 'index.js.flow')),
    'does not generate flow when using separate entries',
  );
  t.end();
});
