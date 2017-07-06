#!/usr/bin/env node

const path = require('path');
const args = require('args');
const chalk = require('chalk');
const build = require('../lib/build.js');
const preflight = require('../lib/preflight.js');
const DraftLog = require('draftlog').into(console);

args
  .option('dir', 'Path to package dir', process.cwd())
  .option('skip-preflight', 'Skip preflight check', false);

const flags = args.parse(process.argv);

const title = console.draft('Building package...');

const {node, browser} = build(flags);

const nodePromise = childPromise(node);
const browserPromise = childPromise(browser);

const promises = [nodePromise, browserPromise];

const preflightPromise = flags.skipPreflight
  ? null
  : preflight(path.join(flags.dir, 'package.json'));

if (preflightPromise) {
  promises.unshift(preflight);
}

let frame = 0;
const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

const logs = new Set();

if (preflight) {
  logs.add(
    createProgress(preflightPromise, {
      progress: 'Preflight checks...',
      resolved: 'Preflight checks passed.',
      rejected: 'Preflight checks failed.',
    })
  );
}

logs.add(
  createProgress(nodePromise, {
    progress: 'Building node package...',
    resolved: 'Node package build succeeded.',
    rejected: 'Node package build failed.',
  })
);
logs.add(
  createProgress(browserPromise, {
    progress: 'Building browser package...',
    resolved: 'Browser package build succeeded.',
    rejected: 'Browser package build failed.',
  })
);

function createProgress(promise, {progress, resolved, rejected}) {
  const log = console.draft(Loading(progress));
  const updater = () => {
    log(Loading(progress));
  };
  promise.then(
    () => {
      logs.delete(updater);
      log(Completed(resolved));
    },
    err => {
      logs.delete(updater);
      log(Errored(rejected));
      console.log(chalk.red(err));
    }
  );
  return updater;
}

const done = Promise.all(promises);

function update() {
  frame = (frame + 1) % frames.length;

  for (const updater of logs) {
    updater();
  }
}

const interval = setInterval(update, 120);

done.then(
  () => {
    clearInterval(interval);
    title(chalk.blue('Build complete.'));
  },
  () => {
    clearInterval(interval);
    title(chalk.yellow('Build encountered errors.'));
    process.exitCode = 1;
  }
);

function childPromise(child) {
  let err = '';
  child.stderr.on('data', data => {
    err += data;
  });
  return new Promise((resolve, reject) => {
    child.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(err);
      }
    });
  });
}

function Loading(text) {
  return `${chalk.blue(frames[frame])} ${chalk.yellow(text)}`;
}

function Errored(text) {
  return chalk.red(`✘ ${text}`);
}

function Completed(text) {
  return chalk.green(`✔ ${text}`);
}
