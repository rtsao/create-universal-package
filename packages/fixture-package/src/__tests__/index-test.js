import * as fixture from '../index.js';

import test from 'tape';

test('exports identity', t => {
  t.equal(typeof fixture.identity, 'function');
  t.end();
});

test('exports noop', t => {
  t.equal(typeof fixture.noop, 'function');
  t.end();
});

test('exports foo', t => {
  t.equal(typeof fixture.foo, 'function');
  t.end();
});
