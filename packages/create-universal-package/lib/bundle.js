const path = require('path');
const rollup = require('rollup');

function build({env, entry, dest, config}) {
  const {plugins, template, formats} = require(config);
  let cache;
  rollup
    .rollup({
      entry,
      cache,
      plugins,
    })
    .then(bundle => {
      cache = bundle;
      for (const format of formats) {
        bundle.write({
          format,
          dest: path.join(dest, template({env, format})),
          sourceMap: true,
        });
      }
    })
    .catch(err => {
      console.error(toErrorStack(err));
      process.exitCode = 1;
    });
}

function toErrorStack(err) {
  if (err._babel) {
    return `${err.name}: ${err.message}\n${err.codeFrame}`;
  } else {
    return err.stack;
  }
}

module.exports = build;
