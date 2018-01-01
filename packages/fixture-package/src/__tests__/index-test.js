import * as fixture from '../index.js';

import test from 'tape-cup';

test('exports square', t => {
  t.equal(typeof fixture.square, 'function');
  t.end();
});
