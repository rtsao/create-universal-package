#!/usr/bin/env node

const args = require('args');

args.command('build', 'Build your package', ['b']);

const flags = args.parse(process.argv);
