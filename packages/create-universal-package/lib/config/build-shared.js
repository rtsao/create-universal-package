const template = ({env, format, esEdition}) => `${env}.${format}${esEdition ? `.${esEdition}` : ''}.js`;
const formats = ['es', 'cjs'];

module.exports = {
  template,
  formats,
};
