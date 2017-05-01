import test from 'tape';

import * as b from '../b.js';

test('b', t => {
  t.equal(b.default, 'b');
  t.end();
});
