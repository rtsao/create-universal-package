# create-universal-package

A toolchain for developing universal (Node.js and browser) JavaScript packages.

### Globals

##### `__NODE__` and `__BROWSER__`
Aliases for either `true` or `false` depending on the build target. Use this in conjunction with conditionals to check for environment, and dead code will automatically be eliminated appropriately.

For linting purposes, `__BROWSER__` and/or `__NODE__` conditional checks establish appropriate environment globals. For example:

```js
process.title; // fails `cup/no-undef`
window.location; // fails `cup/no-undef`

// passes lint
if (__BROWSER__) {
  document.body.appendChild(document.createTextNode('hello world'));
}

// passes lint
if (__NODE__) {
  process.stdout.write('hello world');
}

// passes lint
const topLevel = __BROWSER__ ? window : global;
```

By default, only universal globals (e.g. `setTimeout` and `console`) are set everywhere.

##### `__DEV__`
Alias for `process.env.NODE_ENV !== 'production'`. By convention, it is assumed that module consumers are statically inlining the value of `process.env.NODE_ENV` in browser bundles.
