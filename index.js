var TileReduce = new require('tile-reduce');
var sprintf = require('sprintf');

var bboxAtlanta = [ -84.52, 33.61, -84.23, 33.93 ];
var opts = {
  zoom: 15,
  tileLayers: [
      {
        name: 'osmdata',
        mbtiles: '/mnt/data/latest.planet.mbtiles',
        layers: ['osm']
      }
    ],
  map: __dirname + '/fruit.js'
};

var totals = null;

var tilereduce = TileReduce(bboxAtlanta, opts);

tilereduce.on('reduce', function(result) {
  if (totals === null) {
    totals = result;
  }
  else {
    Object.keys(result).forEach(function(fruit) {
      totals[fruit][0] += result[fruit][0];
      totals[fruit][1] += result[fruit][1];
    });
  }
});

tilereduce.on('end', function() {
  Object.keys(totals).forEach(function(fruit) {
    console.log(sprintf('%10s: %6d found, %6.1f km', fruit, totals[fruit][0], totals[fruit][1]));
  });
});

tilereduce.run();
