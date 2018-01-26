#!/usr/bin/env node

const args = require('args');
args
  .option('dir', 'Path to package dir', process.cwd())
  .option('skip-preflight', 'Skip preflight check', false)
  .option('skip-flow', 'Skip generation of flow libdef', false)
  .option('force-flow', 'Force generation of flow libdef', false)
  .option(
    'separate-entries',
    'Use src/index.browser.js and src/index.node.js instead of src/index.js',
    false,
  )
  .option('tests', 'Build tests', false)
  .option('tests-only', 'Build test bundles only', false);

const flags = args.parse(process.argv);

const build = require('../lib/build.js');
const jobs = build(flags, {node: true, browser: true}, !flags.skipPreflight);

const logger = process.stdout.isTTY
  ? require('./logger.js')
  : require('./logger-ci.js');

logger(jobs);
