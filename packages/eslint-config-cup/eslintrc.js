module.exports = {
  globals: {
    __NODE__: false,
    __BROWSER__: false,
    __DEV__: false,
  },

  env: {
    /**
     * We only want globals shared by both node and browser by default
     * (setTimeout, console, etc.)
     * The rest will be controlled by env settings in the actual configs
     */
    'shared-node-browser': true,
    /**
     * Set ES6 globals (Map, Set, etc.)
     * Note: this also sets parserOptions: {ecmaVersion: 6}
     * (see https://github.com/eslint/eslint/blob/master/conf/environments.js)
     */
    es6: true,
  },

  plugins: ['eslint-plugin-cup'],

  rules: {
    'no-undef': 'off',
    'cup/no-undef': 'error',
  },

  parserOptions: {
    /**
     * sourceType: 'module' allows for import/export
     */
    sourceType: 'module',
  },
};
