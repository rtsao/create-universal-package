import test from 'tape-cup';

test('should not be run', t => {
  t.fail('a failing assertion');
  t.end();
});
