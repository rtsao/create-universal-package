#!/usr/bin/env node

const args = require('args');
args
  .option('dir', 'Path to package dir', process.cwd())
  .option('force-flow', 'Force generation of flow libdef', false)
  .option('skip-flow', 'Skip generation of flow libdef', false)
  .option('watch', 'Watch files', false);

const flags = args.parse(process.argv);

require('../lib/build/index.js')(flags).catch(console.error);
