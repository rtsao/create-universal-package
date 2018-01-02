const webpack = require('webpack');
const babel = require('../rollup-plugin-babel');
const path = require('path');

module.exports = function buildBrowser(
  inputOptions,
  babelConfig,
  outputs,
  dir,
) {
  babelConfig.exclude = 'node_modules/**';
  inputOptions.plugins = [babel(babelConfig)];

  return new Promise((resolve, reject) => {
    const compiler = webpack({
      entry: `multi-entry-loader?include[]=${dir}/src/**/__tests__/*.js,exclude[]=${dir}/src/**/__tests__/*.node.js!`,
      output: {
        path: path.dirname(outputs[0].file),
        filename: path.basename(outputs[0].file),
      },
      // TODO: sourcemaps
      // devtool: 'cheap-module-eval-source-map',
      node: {
        // required by tape TODO: remove this
        fs: 'empty',
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            include: [path.join(dir, 'src')],
            exclude: [/node_modules/],
            loader: require.resolve('../rollup-loader.js'),
            options: {
              plugins: inputOptions.plugins,
              pureExternalModules: inputOptions.pureExternalModules,
            },
          },
        ],
      },
    });

    compiler.run((err /* stats */) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
