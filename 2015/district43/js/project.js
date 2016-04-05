var map = L.map('map').setView([45.5400, -122.6819], 11);

L.esri.basemapLayer('Gray').addTo(map);

// function style(feature) {
//     return {
//         fillColor: '#2171b5',
//         weight: 1,
//         opacity: 1,
//         color: 'rgba(250,250,250,0)',
//         fillOpacity: 0.9
//     };
// }


L.geoJson(district43, {
      style: style
    }).addTo(map);

// Disable drag and zoom handlers.
  map.touchZoom.disable();
  map.scrollWheelZoom.disable();

// Disable tap handler, if present.
  if (map.tap) map.tap.disable();