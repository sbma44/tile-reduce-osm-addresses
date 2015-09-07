var turf = require('turf');

module.exports = function (tileLayers, opts, done) {

    var fruitCount = {
        apple: [0, 0],
        banana: [0, 0],
        cherry: [0, 0],
        grape: [0, 0],
        lemon: [0, 0],
        mango: [0, 0],
        orange: [0, 0],
        peach: [0, 0],
        pear: [0, 0]
    };

    var totalRoads = 0, totalRoadLength = 0;

    tileLayers.osmdata.osm.features.forEach(function(feature) {
        if (feature.properties.highway && feature.properties.name && (feature.geometry.type === 'LineString')) {
            var roadLength = turf.lineDistance(feature, 'kilometers');
            Object.keys(fruitCount).forEach(function(fruit) {
                var re = new RegExp('(^|\\s)' + fruit + '.*', 'i');
                if(re.test(feature.properties.name)) {
                    fruitCount[fruit][0] += 1;
                    fruitCount[fruit][1] += roadLength;
                }
            });

            totalRoads += 1;
            totalRoadLength += roadLength;
        }
    });

    fruitCount.total = [totalRoads, totalRoadLength];

    done(null, fruitCount);
}
