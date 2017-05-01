import test from 'tape';

import * as a from '../a.js';

test('a', t => {
  t.equal(a.default, 'a');
  t.end();
});
