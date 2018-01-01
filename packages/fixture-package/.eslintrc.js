module.exports = {
  extends: [
    'plugin:react/recommended',
    require.resolve('eslint-config-cup'),
    require.resolve('eslint-config-cup-recommended'),
  ],

  parser: 'babel-eslint',

  parserOptions: {
    ecmaVersion: 2018,

    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
  },

  plugins: ['eslint-plugin-prettier'],

  rules: {
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
