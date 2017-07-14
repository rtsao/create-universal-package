const path = require('path');
const rollup = require('rollup');

function build({env, entry, dest, config, babelConfig}) {
  const esEditions = ['', 'es2015'];
  for (const esEdition of esEditions) {
    const {plugins, template, formats} = require(config)(babelConfig, esEdition);
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
        for (const format of formats) {
          bundle.write({
            format,
            dest: path.join(dest, template({env, format, esEdition})),
            sourceMap: true,
          });
        }
      })
      .catch(err => {
        console.error(toErrorStack(err));
        process.exitCode = 1;
      });
  }
}

function toErrorStack(err) {
  if (err._babel) {
    return `${err.name}: ${err.message}\n${err.codeFrame}`;
  } else {
    return err.stack;
  }
}

module.exports = build;
