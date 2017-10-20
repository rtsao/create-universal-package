const env = process.argv[2];
const entry = process.argv[3];
const dest = process.argv[4];
const config = process.argv[5];
const babelConfig = JSON.parse(process.argv[6]);
const moduleName = process.argv[7];
const globals = parseGlobals(process.argv[8]);

const bundle = require('./bundle.js');
const bundleUmd = require('./bundle-umd.js');

function parseGlobals(globals) {
  const parsedGlobals = {};
  if (globals && globals !== 'undefined') {
    globals.split(',').forEach((globalModule) => {
      const [moduleName, globalModuleName] = globalModule.split(':');
      parsedGlobals[moduleName] = globalModuleName;
    });
  }
  return parsedGlobals;
}

if (env === 'umd') {
  bundleUmd({env, entry, dest, config, babelConfig, moduleName, globals});
} else {
  bundle({env, entry, dest, config, babelConfig});
}
