const env = process.argv[2];
const entry = process.argv[3];
const dest = process.argv[4];
const config = process.argv[5];

// set cup env (consumed by babel-preset-cup)
process.env.CUP_TARGET = env;

const bundle = require('./bundle.js');

bundle({env, entry, dest, config});
