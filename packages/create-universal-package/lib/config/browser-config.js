const getBabelConfig = require('./get-babel-config.js');

module.exports = (userConfig, esEdition) => getBabelConfig('browser', {ie: [9]}, userConfig, esEdition);
