#!/usr/bin/env node

const args = require('args');
args
  .option('dir', 'Path to package dir', process.cwd())
  .option('skip-coverage', 'Skip coverage instrumentation', false);

const flags = args.parse(process.argv);

const build = require('../lib/build.js');
const jobs = build(flags, {testBrowser: true, testNode: true});

const logger = process.stdout.isTTY
  ? require('./logger.js')
  : require('./logger-ci.js');

logger(jobs);
