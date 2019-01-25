const targetMap = {
  __NODE__: 'node',
  __BROWSER__: 'browser',
};

module.exports = babel => {
  const t = babel.types;

  const nodeEnv = t.memberExpression(
    t.memberExpression(t.identifier('process'), t.identifier('env')),
    t.identifier('NODE_ENV'),
  );
  const nodeEnvCheck = t.binaryExpression(
    '!==',
    nodeEnv,
    t.stringLiteral('production'),
  );

  return {
    visitor: {
      Identifier(path, state) {
        const {name} = path.node;
        if (
          name !== '__DEV__' &&
          name !== '__NODE__' &&
          name !== '__BROWSER__'
        ) {
          return;
        }
        if (path.parent.type === 'MemberExpression') {
          return;
        }
        if (path.parent.type === 'ClassMethod') {
          return;
        }
        if (path.isPure()) {
          return;
        }
        if (name === '__DEV__') {
          path.replaceWith(nodeEnvCheck);
        } else {
          const target = state.opts.target;
          path.replaceWith(t.booleanLiteral(target === targetMap[name]));
        }
      },
    },
  };
};
