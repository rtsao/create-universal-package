#!/usr/bin/env node

const args = require('args');
args
  .option('dir', 'Path to package dir', process.cwd())
  .option('skip-coverage', 'Skip coverage instrumentation', false)
  .option('skip-browser', 'Exclude browser build', false)
  .option('skip-node', 'Exclude node build', false);

const flags = args.parse(process.argv);

const build = require('../lib/build.js');
const jobs = build(flags, {
  testBrowser: !flags.skipBrowser,
  testNode: !flags.skipNode,
});

const logger = process.stdout.isTTY
  ? require('./logger.js')
  : require('./logger-ci.js');

logger(jobs);
