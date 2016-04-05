var map = L.map('map').setView([44.1, -120.5], 7);

// ESRI OPEN TILES
  L.esri.basemapLayer('ShadedRelief').addTo(map);

  var labels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png');

  map.addLayer(labels);


// LAYER OPTIONS
  // Topographic
  // Streets
  // National Geographic
  // Oceans
  // Gray
  // Dark Gray
  // Imagery
  // Shaded Relief

// OPEN STREET MAP BASE TILE
  // L.tileLayer('http://tiles.openpistemap.org/landshaded/{z}/{x}/{y}.png').addTo(map);

// MAP QUEST OPEN TILES
  // L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png').addTo(map);
  // L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png').addTo(map);

// STAMEN
  // L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png').addTo(map);
  // L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.png').addTo(map);
  // L.tileLayer('http://tile.stamen.com/watercolor/{z}/{x}/{y}.png').addTo(map);

// L.geoJson(  GEOGRAPHY ).addTo(map);

// Disable drag and zoom handlers.
  map.touchZoom.disable();
  map.scrollWheelZoom.disable();

// Disable tap handler, if present.
  if (map.tap) map.tap.disable();
