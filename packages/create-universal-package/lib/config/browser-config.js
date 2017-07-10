const getBabelConfig = require('./get-babel-config.js');

module.exports = (userConfig) => getBabelConfig('browser', {ie: [9]}, userConfig);
