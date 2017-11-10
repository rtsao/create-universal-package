module.exports = {
  extends: [
    'eslint:recommended',
  ],

  env: {
    node: true,
    es6: true
  },

  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },

  plugins: ['eslint-plugin-prettier'],

  rules: {
    'no-console': 'off',
    'prettier/prettier': [
      'error',
      {
        useTabs: false,
        printWidth: 80,
        tabWidth: 2,
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: false,
        jsxBracketSameLine: false,
        parser: 'babylon',
        semi: true,
      },
    ],
  },
};
