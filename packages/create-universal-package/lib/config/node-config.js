const getBabelConfig = require('./get-babel-config.js');

module.exports = (userConfig) => getBabelConfig('node', [6], userConfig);
