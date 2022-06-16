/* eslint-disable no-console */

import React from "react";

import { browser } from "./browser";
import { node } from "./node";

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

export function devIdentity(x:string) {
  if (__DEV__) {
    console.log(x);
  }
  return x;
}
