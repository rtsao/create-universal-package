const foo = 'foo';

export function bar() {
  if (__DEV__) {
    if (__TARGET__ === 'node') {
      process.stdout.write('bar');
    }
    if (__TARGET__ === 'browser') {
      document.body.appendChild(document.createTextNode('bar'));
    }
  }
  return foo;
}
