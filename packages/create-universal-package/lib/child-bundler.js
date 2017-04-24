const env = process.argv[2];
const entry = process.argv[3];
const dest = process.argv[4];

process.env.CUP_TARGET = env;

const bundle = require('./bundle.js');

bundle({env, entry, dest});
