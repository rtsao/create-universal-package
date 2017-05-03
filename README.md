# create-universal-package

A toolchain for developing universal (Node.js and browser) JavaScript packages.

### Globals

##### `__NODE__` and `__BROWSER__`
Aliases for either `true` or `false` depending on the build target. Use this in conjunction with conditionals to check for environment, and dead code will automatically be eliminated appropriately.

For linting purposes, `__BROWSER__` and/or `_NODE__` conditional checks establish appropriate environment globals. For example, Node.js globals such as `process` are defined within an `if (__NODE__) {}` block and browser globals such as `window` are defined within an `if (__BROWSER__) {}` block. By default, only universal globals are defined (e.g. `setTimeout`).

##### `__DEV__`
Alias for `process.env.NODE_ENV !== 'production'`. By convention, it is assumed that module consumers are statically inlining the value of `process.env.NODE_ENV` in browser bundles.
