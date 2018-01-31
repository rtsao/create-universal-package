#!/usr/bin/env node

const args = require('args');
args.option('dir', 'Path to package dir', process.cwd());

const flags = args.parse(process.argv);

const clean = require('../lib/tasks/clean.js');
clean(flags);
