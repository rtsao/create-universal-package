// @flow

const Worker = require('jest-worker').default;
const glob = require('tiny-glob');
const path = require('path');
const fs = require('fs');
const {promisify} = require('util');
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

/*::

type BuildOpts = {
  dir: string,
  skipFlow: boolean,
  forceFlow: boolean,
  watch: boolean,
  skipPreflight: boolean,
};

*/

module.exports = async function build(argv /*: BuildOpts */) {
  const worker = new Worker(path.join(__dirname, 'worker.js'));
  worker.getStdout().pipe(process.stdout);
  worker.getStderr().pipe(process.stderr);

  if (!argv.skipPreflight) {
    const preflight = require('./preflight.js');
    try {
      await preflight(path.join(argv.dir, 'package.json'));
    } catch (err) {
      worker.end();
      throw err;
    }
  }

  const files = await glob('src/**/*.{js,ts,tsx}', {
    cwd: argv.dir,
    filesOnly: true,
    absolute: true,
  });

  const result = Promise.all(
    files.map(filename => {
      return runBuild(worker, argv.dir, filename);
    }),
  );

  if (argv.watch) {
    const chokidar = require('chokidar');
    const watcher = chokidar.watch('src/**/*.js', {
      cwd: argv.dir,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 50,
        pollInterval: 10,
      },
    });

    for (const type of ['add', 'change']) {
      watcher.on(type, filename => {
        runBuild(worker, argv.dir, filename);
      });
    }
  } else {
    await result;
    worker.end();
  }

  if (!argv.skipFlow && (argv.forceFlow || hasFlowConfig(argv.dir))) {
    await generateFlowLibdef(argv.dir);
  }
};

async function runBuild(worker, root, filename) {
  try {
    await worker.buildFile(root, filename);
    console.log(`built ${path.relative(root, filename)}`);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

function hasFlowConfig(dir) {
  const configPath = path.join(dir, '.flowconfig');
  return fs.existsSync(configPath);
}

async function generateFlowLibdef(dir) {
  const fileContent = `// @flow

export * from "../src/index.js";
`;

  const filepath = path.resolve(dir, 'dist-node-cjs/index.js.flow');

  const dirname = path.dirname(filepath);

  if (!fs.existsSync(dirname)) {
    await mkdir(dirname, {recursive: true});
  }
  return writeFile(filepath, fileContent);
}
