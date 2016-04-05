var map = L.map('map').setView([44.876175, -120.880440], 7);

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


L.geoJson(district59, {
      style: style
    }).addTo(map);

// Disable drag and zoom handlers.
  map.touchZoom.disable();
  map.scrollWheelZoom.disable();

// Disable tap handler, if present.
  if (map.tap) map.tap.disable();