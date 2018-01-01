const {promisify} = require('util');
const execFile = promisify(require('child_process').execFile);
const flow = require('flow-bin');
const mkdir = promisify(require('fs').mkdir);

module.exports = async function genFlowLibdef(filePath, outDir) {
  try {
    await mkdir(outDir);
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
  return execFile(flow, ['gen-flow-files', filePath, '--out-dir', outDir]);
};
