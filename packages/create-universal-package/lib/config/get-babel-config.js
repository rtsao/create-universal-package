const getBabelConfig = (env, targets) => ({
  presets: [
    [
      require.resolve('babel-preset-env'),
      {
        targets: env === 'node'
          ? {
              node: targets,
            }
          : {
              browsers: targets,
            },
        modules: false,
        loose: true,
        useBuiltIns: true,
        debug: false,
      },
    ],
  ],
  plugins: [
    [
      require.resolve('babel-plugin-transform-cup-globals'),
      {
        target: env,
      },
    ],
  ],
  babelrc: false,
});

module.exports = getBabelConfig;
