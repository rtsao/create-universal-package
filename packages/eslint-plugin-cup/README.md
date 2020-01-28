# eslint-plugin-cup

ESLint rules for create-universal-package

## Rules

### `cup/no-undef`

The same as the vanilla `no-undef`, but only allows environment-specific globals if guarded by environment checks.

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
