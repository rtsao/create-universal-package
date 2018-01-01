// @flow

import a from './foo/a.js';
import b from './foo/b.js';
import pure from '@cup/fixture-dependency-pure';
import React from 'react';

import crypto from 'crypto';

export function square(x: number) {
  return x * x;
}

export function hash(str: string) {
  if (__BROWSER__) {
    return str;
  } else {
    // crypto dependency should be eliminated from browser bundle
    return crypto.createHmac('sha256', str).digest('hex');
  }
}

if (__NODE__) {
  // pure dependency should be eliminated from browser bundle
  process.stdout.write(pure());
}

export function Component() {
  return <div>Hello World</div>;
}

export function Component2() {
  return React.createElement('div');
}

export function log() {
  return __DEV__ ? a : b;
}
