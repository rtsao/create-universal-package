const fs = require('fs-extra');
const path = require('path');

async function fileExists(filepath) {
  return fs
    .access(filepath)
    .then(() => true)
    .catch(() => false);
}

function fileExistsSync(filepath) {
  try {
    fs.accessSync(filepath);
    return true;
  } catch (e) {
    return false;
  }
}

async function writeDeepFile(filepath, content) {
  const dirpath = path.dirname(filepath);

  if (!(await fileExists(dirpath))) {
    await fs.mkdirp(dirpath);
  }

  return fs.writeFile(filepath, content);
}

module.exports = {
  fileExists,
  fileExistsSync,
  writeDeepFile,
};
