const babelCore = require('@babel/core');
const rollupPluginutils = require('rollup-pluginutils');

module.exports = function babel(options) {
  options = Object.assign({}, options || {});

  const filter = rollupPluginutils.createFilter(
    options.include,
    options.exclude,
  );
  delete options.include;
  delete options.exclude;

  if (options.sourceMap !== false) {
    options.sourceMaps = true;
  }
  if (options.sourceMaps !== false) {
    options.sourceMaps = true;
  }
  delete options.sourceMap;

  let warn = msg => console.warn(msg); // eslint-disable-line no-console

  return {
    name: 'babel',

    options: function options$1(options) {
      warn = options.onwarn || warn;
    },

    transform: function transform$1(code, id) {
      if (!filter(id)) {
        return null;
      }

      let localOpts = Object.assign({filename: id}, options);

      const transformed = babelCore.transform(code, localOpts);

      return {
        code: transformed.code,
        map: transformed.map,
      };
    },
  };
};
