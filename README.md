# create-universal-package

A toolchain for developing universal (Node.js and browser) JavaScript packages.

### Globals

##### `__TARGET__`
Alias for either `'browser'` or `'node'` depending on the build target. Use this in conjunction with conditionals to check for environment, and dead code will automatically be eliminated appropriately.

For linting purposes, `__TARGET__` conditional checks establish appropriate environment globals. For example  `process` within `if (__TARGET__ === 'node') {}`and `window` within a `if (__TARGET__ === 'browser') {}` block. By default, only universal globals are defined (e.g. `setTimeout`).

##### `__DEV__`
Alias for `process.env.NODE_ENV !== 'production'`. By convention, it is assumed that module consumers are statically inlining the value of `process.env.NODE_ENV` in browser bundles.
