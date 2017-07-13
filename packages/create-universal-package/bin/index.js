#!/usr/bin/env node

const args = require('args');

args
  .command('build', 'Build your package', ['b'])
  .command('build-tests', 'Build your tests')
  .command('clean', 'Clean build artifacts', ['c']);

const flags = args.parse(process.argv);
