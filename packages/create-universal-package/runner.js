const Worker = require('jest-worker');
const glob = require('tiny-glob');
const fs = require('fs');

async function main() {
  const myWorker = new Worker(`${__dirname}/worker2.js`);

  let files = await glob('src/**/*.js');

  const result = Promise.all(files.map(file => build(myWorker, file)));

  if (watch) {
    const chokidar = require('chokidar');

    for (file of files) {
      const watcher = chokidar.watch('src/**/*.js', {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 50,
          pollInterval: 10,
        },
      });

      ['add', 'change'].forEach(type => {
        watcher.on(type, filename => {
          build(myWorker, filename);
        });
      });
    }
  } else {
    await result;
    myWorker.end();
  }

  if (false) {
    genFlowLibdef(outDir, filepath);
  }
}

async function build(worker, filename) {
  try {
    await worker.build(filename);
    console.log(`built ${filename}`);
  } catch (err) {
    console.err(err);
  }
}

async function genFlowLibdef(outDir, filePath) {
  try {
    await mkdir(outDir);
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
  return writeFile(
    filePath,
    `// @flow

export * from "../src/index.js";
`,
  );
}

main();
