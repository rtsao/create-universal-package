const babel = require('@babel/core');
const fs = require('fs-extra');
const path = require('path');
const {writeDeepFile} = require('../_utils.js');

async function buildFile(filepath, targets, argv) {
  const fileContents = await fs.readFile(path.join(argv.dir, filepath), 'utf8');

  return Promise.all(
    targets.map(async target => {
      const {babelOpts, outputDir} = target;
      const result = babel.transformSync(fileContents, {
        ...babelOpts,
        cwd: argv.dir,
        filename: filepath,
      });

      return writeDeepFile(
        `${outputDir}/${filepath
          .split(path.sep)
          .slice(1)
          .join(path.sep)}`,
        result.code,
      );
    }),
  );
}

exports.buildFile = buildFile;
