const pluginsData = require('@rtsao/babel-preset-env/data/plugin-features.js');
const builtinsData = require('@rtsao/babel-preset-env/data/built-in-features.js');

const keysByLanguage = (obj) =>
  ['es2015', 'es2016', 'es2017'].reduce(
    (acc, lang) => Object.assign(acc, {[lang]: Object.keys(obj[lang])}),
    {}
  );

const plugins = keysByLanguage(pluginsData);
const builtins = keysByLanguage(builtinsData);

module.exports = {
  es2015: [...plugins.es2015, ...builtins.es2015],
  es2016: [...plugins.es2016, ...builtins.es2016],
  es2017: [...plugins.es2017, ...builtins.es2017]
}
