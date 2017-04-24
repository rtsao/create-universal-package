module.exports = function buildPreset(context, opts = {}) {
  const target = opts.target || process.env.CUP_TARGET;

  if (target !== 'node' && target !== 'browser') {
    throw new Error(
      `babel-preset-cup: 'target' option must be either 'node' or 'browser'`
    );
  }

  return {
    presets: [
      [
        require.resolve('babel-preset-env'),
        {
          targets: target === 'node'
            ? {
                node: [6]
              }
            : {
                browsers: {
                  ie: [9]
                }
              },
          modules: false,
          loose: true,
          useBuiltIns: true,
          debug: false
        }
      ]
    ],
    plugins: [
      [
        require.resolve('babel-plugin-transform-cup-globals'),
        {
          target
        }
      ]
    ]
  };
};
