const importLazy = require('import-lazy')(require);

exports.build = importLazy('./tasks/build.js');
exports.preflight = importLazy('./tasks/preflight.js');
exports.buildBrowser = importLazy('./tasks/build-browser.js');
exports.genFlowLibdef = importLazy('./tasks/gen-flow-libdef.js');
