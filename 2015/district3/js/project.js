var map = L.map('map').setView([42.247186, -123.256157], 9);

// ESRI OPEN TILES
  L.esri.basemapLayer('Gray').addTo(map);

function style(feature) {
    return {
        fillColor: '#a50f15',
        weight: 1,
        opacity: 1,
        color: 'rgba(250,250,250,0)',
        fillOpacity: 0.9
    };
}

L.geoJson(houseDistrict3, {
      style: style
    }).addTo(map);

// Disable drag and zoom handlers.
  map.touchZoom.disable();
  map.scrollWheelZoom.disable();

// Disable tap handler, if present.
  if (map.tap) map.tap.disable();