const path = require('path');
const tape = require('tape');
const {promisify} = require('util');
const cp = require('child_process');
const fs = require('fs');
const exec = promisify(cp.exec);
const glob = require('tiny-glob');

tape('fixture package transpile', async t => {
  const dir = path.join(__dirname, '../../fixture-package/');
  const srcFiles = await glob('src/**/*.js', {cwd: dir});
  const expectedFiles = [
    'dist-browser-esm',
    'dist-node-cjs',
    'dist-node-esm',
  ].reduce((result, targetDir) => {
    return result.concat(
      srcFiles.map(filepath => filepath.replace(/^src/, targetDir)),
    );
  }, []);

  await exec(`yarn clean`, {cwd: dir});
  await exec(`yarn build`, {cwd: dir});
  expectedFiles.map(file => path.join(dir, file)).forEach((file, index) => {
    t.ok(fs.existsSync(file), `${expectedFiles[index]} exists`);
  });
  t.end();
});
