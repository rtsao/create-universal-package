const Worker = require('jest-worker').default;
const glob = require('tiny-glob');
const path = require('path');
const {fileExistsSync, writeDeepFile} = require('../_utils.js');

module.exports = async function build(argv = {}) {
  const builderWorker = new Worker(path.join(__dirname, 'worker.js'));
  const targets = generateTargets(argv);
  const files = await glob('src/**/*.js', {cwd: argv.dir});
  const result = Promise.all(
    files.map(file => runBuild(builderWorker, file, targets, argv)),
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
        runBuild(builderWorker, filename, targets, argv);
      });
    }
  } else {
    await result;
    builderWorker.end();
  }

  if (!argv.skipFlow && (argv.forceFlow || hasFlowConfig(argv))) {
    await generateFlowLibdef(targets, argv);
  }
};

function generateTargets(argv) {
  return [
    {
      outputDir: path.join(argv.dir, 'dist-browser-esm'),
      babelOpts: getBabelOpts({
        target: 'browser',
      }),
    },
    {
      outputDir: path.join(argv.dir, 'dist-node-cjs'),
      babelOpts: getBabelOpts({
        cjs: true,
        target: 'node',
      }),
    },
    {
      outputDir: path.join(argv.dir, 'dist-node-esm'),
      babelOpts: getBabelOpts({
        target: 'node',
      }),
    },
  ];
}

function getBabelOpts(opts = {}) {
  return {
    plugins: [
      require.resolve('@babel/plugin-syntax-flow'),
      require.resolve('@babel/plugin-transform-flow-strip-types'),
      [
        require.resolve('babel-plugin-transform-cup-globals'),
        {
          target: opts.target,
        },
      ],
      [
        require.resolve('babel-plugin-transform-prune-unused-imports'),
        {
          falsyExpressions: [
            opts.target === 'browser' && '__NODE__',
            opts.target === 'node' && '__BROWSER__',
          ].filter(Boolean),
          truthyExpressions: [
            opts.target === 'browser' && '__BROWSER__',
            opts.target === 'node' && '__NODE__',
          ].filter(Boolean),
        },
      ],
      opts.cjs && require.resolve('@babel/plugin-transform-modules-commonjs'),
      opts.cjs && require.resolve('babel-plugin-add-module-exports'),
    ].filter(Boolean),
    sourceMaps: 'inline',
  };
}

async function runBuild(worker, filepath, targets, argv) {
  try {
    await worker.buildFile(filepath, targets, argv);
    console.log(`built ${filepath}`);
  } catch (err) {
    console.error(err);
  }
}

function hasFlowConfig(argv) {
  const configPath = path.join(argv.dir, '.flowconfig');
  return fileExistsSync(configPath);
}

async function generateFlowLibdef(targets) {
  const fileContent = `// @flow

export * from "../src/index.js";
`;

  return Promise.all(
    targets.map(async target => {
      const filepath = path.join(target.outputDir, 'index.js.flow');
      return writeDeepFile(filepath, fileContent);
    }),
  );
}
