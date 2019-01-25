#!/usr/bin/env node

const args = require('args');
args.option('dir', 'Path to package dir', process.cwd());

const flags = args.parse(process.argv);

require('../clean.js')(flags).catch(err => {
  console.error(err);
  process.exitCode = 1;
});
