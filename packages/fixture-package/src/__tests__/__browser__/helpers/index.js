import test from 'tape-universal';

test('should not be run', t => {
  t.fail('a failing assertion');
  t.end();
});
