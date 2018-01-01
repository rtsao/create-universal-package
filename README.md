# create-universal-package

[![build status][build-badge]][build-href]
[![npm version][npm-badge]][npm-href]

A toolchain for developing universal (Node.js and browser) JavaScript packages.

## Installation

```
npm i create-universal-package --save-dev
```

## Usage

```
  Usage: cup [options] [command]

  Commands:

    build, b     Build your package
    build-tests  Build your tests
    clean, c     Clean build artifacts
    help         Display help

  Options:

    -h, --help     Output usage information
    -v, --version  Output the version number
```

### Tests

Any `.js` files at the root of any `__tests__` directory will be added to the test bundle. For browser-only test files, you can use a `.browser.js` extension. This also works for node-only tests and `.node.js`.

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

### Dependencies

create-universal-package sets `pureExternalModules: true` in Rollup to prune unused imports in scenarios like the following:

```js
import doNodeThing from 'some-package';

export function foo() {
  console.log('foo');
  if (__NODE__) {
    doNodeThing();
  }
}
```

##### Node.js result

```js
import doNodeThing from 'some-package';

export function foo() {
  console.log('foo');
  doNodeThing();
}
```

##### Browser result

```js
export function foo() {
  console.log('foo');
}
```

Notice how the `some-package` import gets eliminated from the browser result. This is what we want, but keep in mind any dependencies that perform side effects when imported could be eliminated.

[build-badge]: https://travis-ci.org/rtsao/create-universal-package.svg?branch=master
[build-href]: https://travis-ci.org/rtsao/create-universal-package
[npm-badge]: https://badge.fury.io/js/create-universal-package.svg
[npm-href]: https://www.npmjs.com/package/create-universal-package
