var path = require('path');
var deps = [];

var dataFilePath = path.resolve(path.join(__dirname, '../../demo/demo.data.js'));

delete require.cache[dataFilePath];

var data = require(dataFilePath);

deps.push (dataFilePath);

data.content = "alignment";
data.gridBlocks = [];

for (let i = 0; i < 12; i++) {
  data.gridBlocks.push(i);
}

data.grids = [];

for (let i = 0; i < 2; i++) {
  let grid = {
    class: 'grid-' + i,
    columns: []
  };

  for (let j = 0; j < 6; j++) {
    let column = {
      class: 'w' + i
    };

    grid.columns.push(column);
  }

  data.grids.push(grid);
}

module.exports = {
  deps: deps,
  data: data
};
