const path = require('path');
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
    exposedMethods: ['build', 'preflight', 'buildBrowser'],
  });

  const inputOptions = {
    input: path.join(opts.dir, 'src/index.js'),
    pureExternalModules: true,
  };

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
          getBabelConfig('browser', '5', userBabelConfig, true),
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
        inputOptions,
        getBabelConfig('node', '8.9.0', userBabelConfig),
        [
          {
            file: path.join(opts.dir, 'dist/node.es.js'),
            format: 'es',
            sourcemap: true,
          },
          {
            file: path.join(opts.dir, 'dist/node.cjs.js'),
            format: 'cjs',
            sourcemap: true,
          },
        ],
      ],
    },
    variants.browser && {
      name: 'build:browser (es5)',
      args: [
        inputOptions,
        getBabelConfig('browser', '5', userBabelConfig, true),
        [
          {
            file: path.join(opts.dir, 'dist/browser.es5.es.js'),
            format: 'es',
            sourcemap: true,
          },
          {
            file: path.join(opts.dir, 'dist/browser.es5.cjs.js'),
            format: 'cjs',
            sourcemap: true,
          },
        ],
      ],
    },
    variants.browser && {
      name: 'build:browser (es2015)',
      args: [
        inputOptions,
        getBabelConfig('browser', '2015', userBabelConfig, true),
        [
          {
            file: path.join(opts.dir, 'dist/browser.es2015.es.js'),
            format: 'es',
            sourcemap: true,
          },
          {
            file: path.join(opts.dir, 'dist/browser.es2015.cjs.js'),
            format: 'cjs',
            sourcemap: true,
          },
        ],
      ],
    },
    variants.browser && {
      name: 'build:browser (es2017)',
      args: [
        inputOptions,
        getBabelConfig('browser', '2017', userBabelConfig),
        [
          {
            file: path.join(opts.dir, 'dist/browser.es2017.es.js'),
            format: 'es',
            sourcemap: true,
          },
          {
            file: path.join(opts.dir, 'dist/browser.es2017.cjs.js'),
            format: 'cjs',
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
          input: path.join(
            opts.dir,
            'src/{**/__tests__/__node__,**/__tests__,__tests__,__tests__/__node__}/*.js',
          ),
          pureExternalModules: true,
        },
        getBabelConfig('node', '8.9.0', userBabelConfig),
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
        worker: worker.preflight(path.join(opts.dir, 'package.json')),
        name: 'preflight',
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

function getBabelConfig(env, target, {plugins, presets} = {}, fastAsync) {
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
      [
        require.resolve('@babel/preset-stage-3'),
        {
          useBuiltIns: true,
          loose: true,
        },
      ],
      // Note: presets run last to first, so user-defined presets run first
    ]
      .concat(presets)
      .filter(Boolean),
    plugins: (fastAsync
      ? [
          [
            require.resolve('fast-async'),
            {
              spec: true,
            },
          ],
        ]
      : []
    )
      .concat(plugins, [
        // Note: plugins run first to last, so user-defined plugins run first
        [
          require.resolve('babel-plugin-transform-cup-globals'),
          {
            target: env,
          },
        ],
      ])
      .filter(Boolean),
    // Never allow .babelrc usage
    babelrc: false,
  };
}
