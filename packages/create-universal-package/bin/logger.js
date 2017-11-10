let frame = 0;
const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

const chalk = require('chalk');
require('draftlog').into(console);

const logs = new Set();

module.exports = function logger(jobs) {
  const title = console.draft('Building package...');

  jobs.forEach(job => {
    logs.add(
      createProgress(job.worker, {
        progress: job.pending,
        resolved: job.success,
        rejected: job.failure,
      }),
    );
  });

  const interval = setInterval(update, 120);

  const done = Promise.all(jobs.map(job => job.worker));

  done.then(
    () => {
      clearInterval(interval);
      title(chalk.blue('Build complete.'));
    },
    () => {
      clearInterval(interval);
      title(chalk.yellow('Build encountered errors.'));
      process.exitCode = 1;
    },
  );
};

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
    },
  );
  return updater;
}

function update() {
  frame = (frame + 1) % frames.length;

  for (const updater of logs) {
    updater();
  }
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
