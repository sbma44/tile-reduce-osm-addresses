var TileReduce = new require('tile-reduce');
var sprintf = require('sprintf');

var bboxSF = [-122.66, 37.61, -122.15, 38],
    bboxDC = [ -77.19, 38.79, -76.9, 39 ],
    bboxAtlanta = [ -84.52, 33.61, -84.23, 33.93 ];

var opts = {
  zoom: 15,
  tileLayers: [
      {
        name: 'osmdata',
        mbtiles: '/Users/tomlee/Desktop/latest.planet.mbtiles',
        layers: ['osm']
      }
    ],
  map: __dirname + '/fruit.js'
};

var totals = null;

var tilereduce = TileReduce(bboxSF, opts);

tilereduce.on('reduce', function(result) {
  if (totals === null) {
    totals = result;
  }
  else {
    Object.keys(result).forEach(function(fruit) {
      totals[fruit][1] += result[fruit][1];
      totals[fruit][2] += result[fruit][2];
    });
  }
});

tilereduce.on('end', function() {
  Object.keys(totals).forEach(function(fruit) {
    console.log(sprintf('%10s %6d ways, %7.1f km, %6.1f%%', totals[fruit][0], totals[fruit][1], totals[fruit][2], (100.0 * totals[fruit][2] / totals['total'][2])));
  });
});

tilereduce.run();
