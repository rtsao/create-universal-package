const fs = require('fs');
const path = require('path');

module.exports = function validateConfig(dir) {
  const configPath = path.join(dir, '.cuprc.js');
  let config;
  if (fs.existsSync(configPath)) {
    config = require(configPath);
    if (!isValid(config)) {
      throw new Error('.cuprc.js invalid');
    }
  } else {
    config = {};
  }
  return config.babel;
};

function isValid(config) {
  return (
    typeof config === 'object' &&
    Object.keys(config).every(el => ['babel'].includes(el)) &&
    config.babel &&
    Object.keys(config.babel).every(el => ['plugins', 'presets'].includes(el))
  );
}
