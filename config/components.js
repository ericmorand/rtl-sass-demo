module.exports = {
  componentRoot: 'src/components',
  plugins: {
    javascript: {
      entry: 'demo.js',
      config: {
        debug: true
      }
    },
    twig: {
      entry: 'demo.twig'
    },
    sass: {
      config: {
        sourceMap: true,
        sourceComments: true,
        sourceMapEmbed: true
      },
      entry: 'demo.scss'
    }
  },
  browserSync: {
    port: 3000,
    open: false,
    notify: false
  },
  chokidar: {
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 100
    }
  }
};