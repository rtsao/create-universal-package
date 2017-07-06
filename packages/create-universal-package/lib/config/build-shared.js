const template = ({env, format}) => `${env}.${format}.js`;
const formats = ['es', 'cjs'];

module.exports = {
  template,
  formats,
};
