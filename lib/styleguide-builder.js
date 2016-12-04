const ComponentsBuilder = require('./components-builder');
const path = require('path');

class Builder extends ComponentsBuilder {
  getBrowserSyncServerPath() {
    return path.join(this.wwwPath, 'styleguide');
  };
}

module.exports = Builder;