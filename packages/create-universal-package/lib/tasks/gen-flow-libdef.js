const {promisify} = require('util');
const writeFile = promisify(require('fs').writeFile);
const mkdir = promisify(require('fs').mkdir);

const libdefSrc = `// @flow

export * from "../src/index.js";
`;

module.exports = async function genFlowLibdef(outDir, filePath) {
  try {
    await mkdir(outDir);
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
  return writeFile(filePath, libdefSrc);
};
