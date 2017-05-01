import a from './foo/a.js';
import b from './foo/b.js';

// Development instrumentation
// This is eliminated in production
if (__DEV__) {
  const devWeakArgMap = new WeakMap();
  const devStrongArgMap = new Map();
  let devArgCounter = 0;
  var countArg = arg => {
    const argType = typeof arg;
    const map = argType === 'object' || argType === 'function'
      ? devWeakArgMap
      : devStrongArgMap;
    if (!map.has(arg)) {
      map.set(arg, devArgCounter++);
    }
  };
  const maps = {weak: devWeakArgMap, strong: devStrongArgMap};
  if (__TARGET__ === 'node') {
    global.__fixture_arg_counts__ = maps;
  }
  if (__TARGET__ === 'browser') {
    window.__fixture_arg_counts__ = maps;
  }
}

export function identity(arg) {
  if (__DEV__) {
    countArg(arg);
  }
  return arg;
}

export function noop(arg) {
  if (__DEV__) {
    countArg(arg);
  }
  return void 0;
}

export function foo() {
  return a + b;
}
