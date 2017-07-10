const env = process.argv[2];
const entry = process.argv[3];
const dest = process.argv[4];
const config = process.argv[5];
const babelConfig = JSON.parse(process.argv[6]);

const bundle = require('./bundle.js');

bundle({env, entry, dest, config, babelConfig});
