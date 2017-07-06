const getBabelConfig = require('./get-babel-config.js');

const browserConfig = getBabelConfig('browser', {ie: [9]});

module.exports = browserConfig;
