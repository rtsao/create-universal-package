module.exports = {
  extends: [
    require.resolve('eslint-config-cup'),
    require.resolve('eslint-config-cup-recommended')
  ],

  plugins: ['eslint-plugin-prettier'],

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

};
