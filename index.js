var TileReduce = new require('tile-reduce');
var tilecover = require('tile-cover');
var fs = require('fs');
var queue = require('queue-async');

var TARGET_ZOOM = 15;
var usa = JSON.parse(fs.readFileSync('./georgia.geojson'));
var tiles = tilecover.geojson(usa.features[0].geometry, { min_zoom: TARGET_ZOOM-4, max_zoom: TARGET_ZOOM-4 });

var q = queue(1);

tiles.features.forEach(function(tile, i) {
    q.defer(function(cb) {
        console.error('processing tile ' + i + '/' + tiles.features.length);
        runtile(tile, cb);
    });
});

function runtile(tile, callback) {

    var bbox = [
        tile.geometry.coordinates[0][0][0],
        tile.geometry.coordinates[0][0][1],
        tile.geometry.coordinates[0][2][0],
        tile.geometry.coordinates[0][2][1]
    ];

    var opts = {
      zoom: TARGET_ZOOM,
      tileLayers: [
          {
            name: 'osmdata',
            mbtiles: '/mnt/data/latest.planet.mbtiles',
            layers: ['osm']
          }
        ],
      map: __dirname+'/map.js'
    };

    var tilereduce = TileReduce(bbox, opts);

    tilereduce.on('reduce', function(result){
      if (result.length > 0)
          console.log(result.map(JSON.stringify).join('\n').trim());
    });
    tilereduce.on('end', callback);

    tilereduce.run();
}
