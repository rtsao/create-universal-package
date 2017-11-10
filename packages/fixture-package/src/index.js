import a from './foo/a.js';
import b from './foo/b.js';
import pure from '@cup/fixture-pure-dependency';
import React from 'react';

import crypto from 'crypto';

// Development instrumentation
// This is eliminated in production
if (__DEV__) {
  const devWeakArgMap = new WeakMap();
  const devStrongArgMap = new Map();
  let devArgCounter = 0;
  var countArg = arg => {
    const argType = typeof arg;
    const map =
      argType === 'object' || argType === 'function'
        ? devWeakArgMap
        : devStrongArgMap;
    if (!map.has(arg)) {
      map.set(arg, devArgCounter++);
    }
  };
  const maps = {weak: devWeakArgMap, strong: devStrongArgMap};
  if (__NODE__) {
    global.__fixture_arg_counts__ = maps;
  }
  if (__BROWSER__) {
    window.__fixture_arg_counts__ = maps;
  }
}

if (__NODE__) {
  // pure dependency should be eliminated from browser bundle
  process.stdout.write(pure());
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

const fooFunc = (num1, num2) => {
  return num1 + num2;
};

export const foo = fooFunc;

export function Component() {
  return <div>Hello World</div>;
}

export function Component2() {
  return React.createElement('div');
}

export class Foo {
  constructor() {
    if (__NODE__) {
      this.a = a;
      this.b = b;
      this.hash = crypto
        .createHmac('sha256', 'hello')
        .update('I love cupcakes')
        .digest('hex');
      this.test = this.hash;
    }
    if (__BROWSER__) {
      this.hash = 'browser only';
    }
  }
}

Foo.test = 'asdsdf';

export class Bar extends Foo {
  qux() {
    return this.hash;
  }
}

export async function test() {
  return 55;
}

Bar.randomProperty = obj => {
  return {
    ...obj,
    hash: this.hash,
  };
};
