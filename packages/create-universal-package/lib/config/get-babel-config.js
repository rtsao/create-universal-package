const getBabelConfig = (env, targets, {plugins, presets, runtimeHelpers = false} = {}) => ({
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
    require.resolve('babel-preset-stage-3'),
    // Note: presets run last to first, so user-defined presets run first
  ].concat(presets).filter(Boolean),
  plugins: [].concat(plugins, [
    // Note: plugins run first to last, so user-defined plugins run first
    [
      require.resolve('babel-plugin-transform-cup-globals'),
      {
        target: env,
      },
    ],
  ]).filter(Boolean),
  runtimeHelpers,
  // Never allow .babelrc usage
  babelrc: false,
});

module.exports = getBabelConfig;
