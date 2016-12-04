const path = require('path');

let pkg = require('../package.json');

let distPath = 'dist';
let assetsDistPath = path.join(distPath);
let scriptsDistPath = path.join(distPath);
let stylesheetsDistPath = path.join(distPath);

module.exports = {
  plugins: {
    javascript: {
      config: {
        plugin: [
          function (bundle, opts) {
            return require('minifyify')(bundle, {map: false});
          }
        ]
      }
    },
    sass: {
      config: {
        sourceMap: false,
        sourceComments: false
      }
    }
  },
  distPath: distPath,
  postcss: {
    plugins: [
      require('cssnano')({
        discardDuplicates: true
      }),
      require('postcss-copy')({
        src: '.',
        dest: distPath,
        template: function (fileMeta) {
          return 'assets/' + fileMeta.hash + '.' + fileMeta.ext;
        },
        relativePath: function (dirname, fileMeta, result, options) {
          return path.relative(fileMeta.src, stylesheetsDistPath);
        },
        hashFunction: function (contents) {
          // sha256
          const createSha = require('sha.js');

          return createSha('sha256').update(contents).digest('hex');
        }
      })
    ]
  },
  paths: {
    tmpPath: 'tmp',
    assetsDistPath: assetsDistPath,
    scriptsDistPath: scriptsDistPath,
    stylesheetsDistPath: stylesheetsDistPath,
  }
};