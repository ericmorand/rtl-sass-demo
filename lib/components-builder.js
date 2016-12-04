const fs = require('fs-extra');
const log = require('log-util');
const merge = require('merge');
const path = require('path');

const chokidar = require('chokidar');
const Stromboli = require('stromboli');
const write = require('../lib/write');

class Builder extends Stromboli {
  constructor() {
    super();

    this.componentsWatchers = new Map();
    this.browserSync = null;
    this.config = null;
    this.wwwPath = 'www';
  };

  start(config) {
    let that = this;

    that.config = config;

    return super.start(config).then(
      function(components) {
        // browserSync
        let browserSync = require('browser-sync').create();

        let browserSyncConfig = merge(config.browserSync, {
          server: that.getBrowserSyncServerPath()
        });

        browserSync.init(browserSyncConfig, function () {
            that.browserSync = browserSync;
          }
        );

        components.forEach(function(component) {
          component.url = ':' + browserSync.instance.getOptions().get('port') + '/' + component.name
        });

        return components;
      }
    );
  };

  pluginPreRenderComponent(plugin, component) {
    let that = this;

    let promises = [];

    // close watchers
    let watcher = null;

    if (that.componentsWatchers.has(component.name)) {
      let componentWatchers = that.componentsWatchers.get(component.name);

      if (componentWatchers.has(plugin.name)) {
        console.log('WATCHER FOR COMPONENT', component.name, 'AND PLUGIN', plugin.name, 'WILL BE CLOSED');

        watcher = componentWatchers.get(plugin.name);

        promises.push(watcher.close());
      }
    }

    return Promise.all(promises);
  };

  pluginRenderComponent(plugin, component) {
    let that = this;
    let pluginRenderComponent = super.pluginRenderComponent;

    return that.pluginPreRenderComponent(plugin, component).then(
      function () {
        return pluginRenderComponent.call(that, plugin, component).then(
          function (component) {
            // write plugin render result to wwwPath folder
            let renderResult = component.renderResults.get(plugin.name);

            return write.writeRenderResult(renderResult, path.join(that.wwwPath, component.name)).then(
              function (files) {
                // watch dependencies
                let watcher = null;
                let dependencies = Array.from(renderResult.getDependencies());

                if (!that.componentsWatchers.has(component.name)) {
                  that.componentsWatchers.set(component.name, new Map());
                }

                let componentWatchers = that.componentsWatchers.get(component.name);

                // console.log('WATCHER WILL WATCH', dependencies, 'USING PLUGIN', plugin.name);

                watcher = that.getWatcher(dependencies, function () {
                  that.pluginRenderComponent(plugin, component)
                });

                componentWatchers.set(plugin.name, watcher);

                // reload Browsersync
                if (that.browserSync) {
                  files.binaries.forEach(function (binary) {
                    if (path.extname(binary) != '.map') {
                      that.browserSync.reload(binary);
                    }
                  });
                }

                return component;
              }
            )
          },
          function(err) {
            console.log(err);
          }
        )
      }
    );
  };

  getBrowserSyncServerPath() {
    return this.wwwPath;
  };

  /**
   *
   * @param files {[String]}
   * @param listener {Function}
   * @returns {Promise}
   */
  getWatcher(files, listener) {
    let that = this;

    return chokidar.watch(files, that.config.chokidar).on('all', function (type, file) {
      that.info(file, type);

      listener.apply(that);
    });
  };
}

module.exports = Builder;