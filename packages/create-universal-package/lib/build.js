const path = require('path');
const fs = require('fs');
const Worker = require('jest-worker').default;
const validateConfig = require('./validate-config');

class Job {
  constructor({worker, name}) {
    this.worker = worker;
    this.pending = `Running ${name}...`;
    this.success = `${name} succeeded.`;
    this.failure = `${name} failed.`;
  }
}

function build(opts, variants = {}, preflight) {
  const worker = new Worker(require.resolve('./worker.js'), {
    exposedMethods: ['build', 'preflight', 'buildBrowser', 'genFlowLibdef'],
  });

  const baseInputOptions = {
    input: path.join(opts.dir, 'src/index.js'),
    pureExternalModules: true,
  };
  const browserInputOptions = {
    ...baseInputOptions,
  };
  const nodeInputOptions = {
    ...baseInputOptions,
  };

  const generateFlowLibdef =
    !opts.separateEntries &&
    !opts.skipFlow &&
    (opts.forceFlow || hasFlowConfig(opts.dir));

  if (opts.separateEntries) {
    browserInputOptions.input = path.join(opts.dir, 'src/index.browser.js');
    nodeInputOptions.input = path.join(opts.dir, 'src/index.node.js');
  }

  const userBabelConfig = validateConfig(opts.dir);

  let jobs = [];

  // do browser test build first since it is the slowest
  if (variants.testBrowser) {
    jobs.push(
      new Job({
        worker: worker.buildBrowser(
          {
            pureExternalModules: true,
          },
          getBabelConfig({
            env: 'browser',
            target: '5',
            userBabelConfig,
            fastAsync: true,
            coverage: !opts.skipCoverage,
          }),
          [
            {
              file: path.join(opts.dir, 'dist-tests/browser.js'),
              format: 'iife',
              sourcemap: true,
            },
          ],
          opts.dir,
        ),
        name: 'build-tests:browser',
      }),
    );
  }

  const builds = [
    variants.node && {
      name: 'build:node',
      args: [
        nodeInputOptions,
        getBabelConfig({env: 'node', target: '8.9.0', userBabelConfig}),
        [
          {
            file: path.join(opts.dir, 'dist/index.es.js'),
            format: 'es',
            sourcemap: true,
          },
          {
            file: path.join(opts.dir, 'dist/index.js'),
            format: 'cjs',
            sourcemap: true,
          },
        ],
      ],
    },
    variants.browser && {
      name: 'build:browser (es5)',
      args: [
        browserInputOptions,
        getBabelConfig({
          env: 'browser',
          target: '5',
          userBabelConfig,
          fastAsync: true,
        }),
        [
          {
            file: path.join(opts.dir, 'dist/browser.es5.es.js'),
            format: 'es',
            sourcemap: true,
          },
          {
            file: path.join(opts.dir, 'dist/browser.es5.js'),
            format: 'cjs',
            sourcemap: true,
          },
        ],
      ],
    },
    variants.browser && {
      name: 'build:browser (es2015)',
      args: [
        browserInputOptions,
        getBabelConfig({
          env: 'browser',
          target: '2015',
          userBabelConfig,
          fastAsync: true,
        }),
        [
          {
            file: path.join(opts.dir, 'dist/browser.es2015.es.js'),
            format: 'es',
            sourcemap: true,
          },
        ],
      ],
    },
    variants.browser && {
      name: 'build:browser (es2017)',
      args: [
        browserInputOptions,
        getBabelConfig({env: 'browser', target: '2017', userBabelConfig}),
        [
          {
            file: path.join(opts.dir, 'dist/browser.es2017.es.js'),
            format: 'es',
            sourcemap: true,
          },
        ],
      ],
    },
  ].filter(Boolean);

  const testBuilds = [
    variants.testNode && {
      name: 'build-tests:node',
      args: [
        {
          input: {
            include: [path.join(opts.dir, 'src/{**/__tests__,__tests__}/*.js')],
            exclude: [
              path.join(opts.dir, 'src/{**/__tests__,__tests__}/*.browser.js'),
            ],
          },

          pureExternalModules: true,
        },
        getBabelConfig({
          env: 'node',
          target: '8.9.0',
          userBabelConfig,
          coverage: !opts.skipCoverage,
        }),
        [
          {
            file: path.join(opts.dir, 'dist-tests/node.js'),
            format: 'cjs',
            sourcemap: true,
          },
        ],
        'node',
      ],
    },
  ].filter(Boolean);

  builds.push(...testBuilds);

  builds.forEach(build => {
    jobs.push(
      new Job({
        worker: worker.build(...build.args),
        name: build.name,
      }),
    );
  });

  if (preflight) {
    // do preflight checks after starting builds
    jobs.push(
      new Job({
        worker: worker.preflight(
          path.join(opts.dir, 'package.json'),
          generateFlowLibdef,
        ),
        name: 'preflight',
      }),
    );
  }

  if (!testBuilds.length && generateFlowLibdef) {
    jobs.push(
      new Job({
        worker: worker.genFlowLibdef(
          path.join(opts.dir, 'dist'),
          path.join(opts.dir, 'dist/index.js.flow'),
        ),
        name: 'flowlibdef',
      }),
    );
  }

  Promise.all(jobs.map(job => job.worker)).then(
    () => {
      worker.end();
    },
    () => {
      worker.end();
    },
  );

  return jobs;
}

module.exports = build;

function hasFlowConfig(dir) {
  return fs.existsSync(path.join(dir, '.flowconfig'));
}

function getBabelConfig({env, target, userBabelConfig, fastAsync, coverage}) {
  const {plugins, presets} = userBabelConfig || {};
  return {
    presets: [
      [
        require.resolve('@rtsao/babel-preset-env'),
        {
          targets:
            env === 'node'
              ? {
                  node: target,
                }
              : {
                  ecmascript: target,
                },
          modules: false,
          loose: true,
          ignoreBrowserslistConfig: true,
          shippedProposals: false,
          useBuiltIns: false,
          exclude: ['transform-async-to-generator', 'transform-regenerator'],
          debug: false,
        },
      ],
      // Note: presets run last to first, so user-defined presets run first
    ]
      .concat(presets)
      .filter(Boolean),
    plugins: []
      .concat(
        fastAsync
          ? [
              [
                require.resolve('fast-async'),
                {
                  spec: true,
                },
              ],
            ]
          : [],
      )
      .concat(coverage ? [require.resolve('babel-plugin-istanbul')] : [])
      .concat(plugins, [
        // Note: plugins run first to last, so user-defined plugins run first
        [
          require.resolve('babel-plugin-transform-cup-globals'),
          {
            target: env,
          },
        ],
        require.resolve('@babel/plugin-transform-flow-strip-types'),
        [
          require.resolve('@babel/plugin-proposal-class-properties'),
          {loose: true},
        ],
        require.resolve('@babel/plugin-proposal-json-strings'),
        require.resolve('@babel/plugin-syntax-dynamic-import'),
        require.resolve('@babel/plugin-syntax-import-meta'),
        require.resolve('@babel/plugin-proposal-object-rest-spread'),
      ])
      .filter(Boolean),
    // Never allow .babelrc usage
    babelrc: false,
  };
}
