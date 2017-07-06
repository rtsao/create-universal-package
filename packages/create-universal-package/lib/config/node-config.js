const getBabelConfig = require('./get-babel-config.js');

const nodeConfig = getBabelConfig('node', [6]);

module.exports = nodeConfig;
