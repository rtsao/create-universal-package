import test from 'tape-cup';

import * as a from '../a.js';

test('a', t => {
  t.equal(a.default, 'a');
  t.end();
});

if (__NODE__) {
  test('a (node)', t => {
    t.equal(a.default, 'a');
    t.end();
  });
}

if (__BROWSER__) {
  test('a (browser)', t => {
    t.equal(a.default, 'a');
    t.end();
  });
}
