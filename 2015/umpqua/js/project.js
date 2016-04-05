var map = L.map('map').setView([43.28956, -123.33403], 15);

// ESRI OPEN TILES
  L.esri.basemapLayer('Imagery').addTo(map);

  // L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(map);

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
  // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

// MAP QUEST OPEN TILES
  // L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png').addTo(map);
  // L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png').addTo(map);

// STAMEN
  // L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png').addTo(map);
  // L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.png').addTo(map);
  // L.tileLayer('http://tile.stamen.com/watercolor/{z}/{x}/{y}.png').addTo(map);

// L.geoJson(  GEOGRAPHY ).addTo(map);
//
// var marker = L.marker([43.28956, -123.33403]).addTo(map);
// marker.bindPopup("<b>Umpqua Community College</b>").openPopup();

var marker = L.marker([43.288532,-123.331277]).addTo(map);
marker.bindPopup("<b>Science Building</b>");

var marker = L.marker([43.288768, -123.331961]).addTo(map);
marker.bindPopup("<b>Snyder Hall</b>");



// Disable drag and zoom handlers.
  map.touchZoom.disable();
  map.scrollWheelZoom.disable();

// Disable tap handler, if present.
  if (map.tap) map.tap.disable();
