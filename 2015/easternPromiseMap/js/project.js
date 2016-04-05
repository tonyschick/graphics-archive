var map = L.map('map').setView([44.1, -120.5], 6);

L.esri.basemapLayer('Gray').addTo(map);

function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties['School Name']) {
        layer.bindPopup( 
            "<h4>" + feature.properties['School Name'] + "</h4><h5>(2012-13)</h5>" +
            "Graduation Rate: <strong>" + feature.properties['4-Year Grad Rate'] + "%</strong></br>" +
            "State Average: <strong>68.66%</strong></br>" + 
            "College Enrollment Rate: <strong>" + feature.properties['College Going Rate'] + "</strong></br>" +
            "State Average: <strong>60.5%</strong></br>" 
          );
    }
}

var customLayer = L.geoJson(null, {
    onEachFeature: onEachFeature
});

var runLayer = omnivore.csv('easternPromise.csv', null, customLayer)
customLayer.addTo(map);

// Disable drag and zoom handlers.
  map.touchZoom.disable();
  map.scrollWheelZoom.disable();

// Disable tap handler, if present.
  if (map.tap) map.tap.disable();