// @flow
/* eslint-disable no-console */

import React from 'react';

import {browser} from './browser.js';
import {node} from './node.js';

if (__NODE__) {
  console.log(node);
}

if (__BROWSER__) {
  console.log(browser);
}

export function square(x: number) {
  return x * x;
}

export function Component() {
  return <div>Hello World</div>;
}

export function devIdentity(x) {
  if (__DEV__) {
    console.log(x);
  }
  return x;
}
