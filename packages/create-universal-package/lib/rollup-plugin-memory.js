function isPath(path) {
  return typeof path === 'string';
}

function isContents(contents) {
  return typeof contents === 'string' || Buffer.isBuffer(contents);
}

module.exports = function memory(config = {}) {
  let path = isPath(config.path) ? config.path : null;
  let contents = isContents(config.contents) ? String(config.contents) : null;

  return {
    options(options) {
      const {entry} = options;
      if (entry && typeof entry === 'object') {
        if (isPath(entry.path)) {
          path = entry.path;
        }
        if (isContents(entry.contents)) {
          contents = String(entry.contents);
        }
      }
      options.input = path;
    },

    resolveId(id) {
      if (path === null || contents === null) {
        throw Error(
          "'path' should be a string and 'contents' should be a string of Buffer",
        );
      }
      if (id === path) {
        return path;
      }
    },

    load(id) {
      if (id === path) {
        return contents;
      }
    },
  };
};
