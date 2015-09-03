var turf = require('turf');

module.exports = function (tileLayers, opts, done) {
    var features = tileLayers.osmdata.osm.features
        .filter(function(f) { return f.properties['addr:housenumber']; });
    done(null, features);
}
