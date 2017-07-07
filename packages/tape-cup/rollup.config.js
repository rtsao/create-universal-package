import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

export default {
  entry: 'src/index.js',
  dest: 'dist/index.js',
  format: 'es',
  plugins: [
    commonjs({include: 'node_modules/**'}),
    globals(),
    builtins(),
    resolve({browser: true}),
  ],
};
