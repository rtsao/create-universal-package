#!/usr/bin/env node

const args = require('args');
args
  .command('build', 'Build your package', ['b'])
  .command('clean', 'Clean build artifacts', ['c']);

args.parse(process.argv);
