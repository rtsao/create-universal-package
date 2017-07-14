const template = ({env, format, esEdition}) => `${env}.${format}.${esEdition}.js`;
const formats = ['es', 'cjs'];

module.exports = {
  template,
  formats,
};
