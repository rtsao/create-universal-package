const path = require('path');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');

const formats = ['es', 'cjs'];

function build({env, entry, dest}) {
  let cache;
  rollup
    .rollup({
      entry,
      cache,
      plugins: [babel()]
    })
    .then(bundle => {
      cache = bundle;
      for (const format of formats) {
        bundle.write({
          format,
          dest: path.join(dest, `${env}.${format}.js`),
          sourceMap: true
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
