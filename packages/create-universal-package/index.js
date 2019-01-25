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
};

*/

module.exports = async function build(argv /*: BuildOpts */) {
  const worker = new Worker(path.join(__dirname, 'worker.js'));
  const a = worker.getStdout();
  const b = worker.getStderr();
  a.pipe(process.stdout);
  b.pipe(process.stderr);
  const files = await glob('src/**/*.js', {
    cwd: argv.dir,
    filesOnly: true,
    absolute: true,
  });

  const result = Promise.all(
    await files.map(filename => {
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
