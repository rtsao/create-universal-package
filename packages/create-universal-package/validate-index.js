function validateIndex(babel) {
  const {types: t} = babel;

  return {
    name: 'ast-transform',
    visitor: {
      Program(path) {
        for (let child of path.get('body')) {
          if (!t.isExportNamedDeclaration(child)) {
            throw child.buildCodeFrameError(
              'For tree shaking purposes, src/index.js must consist only of named export declarations.',
            );
          }
        }
      },
    },
  };
}

module.exports = validateIndex;
