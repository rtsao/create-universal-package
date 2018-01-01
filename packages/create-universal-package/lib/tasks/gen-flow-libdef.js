const {promisify} = require('util');
const execFile = promisify(require('child_process').execFile);
const flow = require('flow-bin');

module.exports = async function genFlowLibdef(filePath, outDir) {
  return execFile(flow, ['gen-flow-files', filePath, '--out-dir', outDir]);
};
