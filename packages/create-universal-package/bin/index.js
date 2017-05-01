#!/usr/bin/env node

const args = require('args');

args
  .command('build', 'Build your package', ['b'])
  .command('build-tests', 'Build your tests');

const flags = args.parse(process.argv);
