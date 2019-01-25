#!/usr/bin/env node

const args = require('args');
args
  .option('dir', 'Path to package dir', process.cwd())
  .option('skip-preflight', 'Skip preflight check', false)
  .option('force-flow', 'Force generation of flow libdef', false)
  .option('skip-flow', 'Skip generation of flow libdef', false)
  .option('watch', 'Watch files', false);

const flags = args.parse(process.argv);

require('../build.js')(flags).catch(err => {
  console.error(err);
  process.exitCode = 1;
});
