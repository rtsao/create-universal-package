const path = require('path');
const rollup = require('rollup');
const toErrorStack = require('./utils').toErrorStack;

function build({entry, dest, config, babelConfig, moduleName, globals}) {
  [true, false].forEach((includeExternals) => {
    [true, false].forEach((minify) => {
      buildUMDVariant({ includeExternals, minify });
    });
  });

  function buildUMDVariant({ includeExternals, minify }) {
    const {plugins, template} = require(config)(babelConfig, includeExternals, minify);
    let cache;
    rollup
      .rollup({
        pureExternalModules: true,
        entry,
        cache,
        plugins,
      })
      .then(bundle => {
        cache = bundle;
        bundle.write({
          format: 'umd',
          dest: path.join(dest, template),
          sourceMap: true,
          moduleName,
          globals,
        });
      })
      .catch(err => {
        console.error(toErrorStack(err));
        process.exitCode = 1;
      });
  }
}

module.exports = build;
