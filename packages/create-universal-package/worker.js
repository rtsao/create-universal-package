const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

async function buildFile(root, filename) {
  const fileContents = readFile(filename, 'utf8');
  const isTypescript = filename.endsWith('.ts') || filename.endsWith('.tsx');

  const baseConfig = babel.loadPartialConfig({
    cwd: root,
    filename,
    root,
    caller: {
      name: 'create-universal-package-worker',
    },
    presets: isTypescript
      ? [['@babel/preset-typescript', {onlyRemoveTypeImports: true}]]
      : [],
    plugins: isTypescript
      ? []
      : [
          require.resolve('@babel/plugin-syntax-flow'),
          require.resolve('@babel/plugin-transform-flow-strip-types'),
        ],
    sourceMaps: 'inline',
  }).options;

  const source = await fileContents;
  const ast = babel.parseSync(source, baseConfig);

  const relative = path
    .relative(`${root}/src`, filename)
    .replace(/(js|ts|tsx)$/, 'js');

  return Promise.all([
    write(
      `${root}/dist-browser-cjs/${relative}`,
      build(
        ast,
        source,
        baseConfig,
        getPlugins({cjs: true, target: 'browser'}),
      ),
    ),
    write(
      `${root}/dist-browser-esm/${relative}`,
      build(ast, source, baseConfig, getPlugins({target: 'browser'})),
    ),
    write(
      `${root}/dist-node-cjs/${relative}`,
      build(ast, source, baseConfig, getPlugins({cjs: true, target: 'node'})),
    ),
    write(
      `${root}/dist-node-esm/${relative}`,
      build(ast, source, baseConfig, getPlugins({target: 'node'})),
    ),
  ]);
}

async function write(filename, contents) {
  try {
    await mkdir(path.dirname(filename), {recursive: true});
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
  return writeFile(filename, contents);
}

function build(ast, source, baseConfig, extraPlugins) {
  const {plugins, ...config} = baseConfig;
  const result = babel.transformFromAstSync(ast, source, {
    ...config,
    plugins: [...plugins, ...extraPlugins],
  });
  return result.code;
}

const expressions = {
  node: {
    truthyExpressions: ['__NODE__'],
    falsyExpressions: ['__BROWSER__'],
  },
  browser: {
    truthyExpressions: ['__BROWSER__'],
    falsyExpressions: ['__NODE__'],
  },
};

function getPlugins({cjs, target}) {
  const {falsyExpressions, truthyExpressions} = expressions[target];
  const plugins = [
    [require.resolve('babel-plugin-transform-cup-globals'), {target}],
    [
      require.resolve('babel-plugin-transform-prune-unused-imports'),
      {falsyExpressions, truthyExpressions},
    ],
  ];

  if (cjs === true) {
    plugins.push(require.resolve('@babel/plugin-transform-modules-commonjs'));
  }

  return plugins;
}

exports.buildFile = buildFile;
