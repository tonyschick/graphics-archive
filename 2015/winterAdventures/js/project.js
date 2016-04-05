  window.onload = function() { initializeTabletopObject() };

  var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1_j-sdJyxHsLhiCZru2UcZXP2V4lGx7pm8Q0ygfVTmHQ/pubhtml';

// Pull data from Google spreadsheet
// And push to our startUpLeaflet function
function initializeTabletopObject(dataSpreadsheet){
  Tabletop.init({
      key: public_spreadsheet_url,
      callback: startUpLeafet,
      simpleSheet: true,
      debug: false
    });
}



// Set Map View
var map = L.map('map').setView([44.3, -121.7], 7);

var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

map.addLayer(layer);

// https://github.com/csessig86/tabletop_to_leaflet

// This function gets our data from our spreadsheet
// Then gets it ready for Leaflet.
// It creates the marker, sets location
// And plots on it on our map
function startUpLeafet(tabletopData) {
  // Tabletop creates arrays out of our data
  // We'll loop through them and create markers for each
  console.log(tabletopData);

  for (var num = 0; num < tabletopData.length; num ++) {
    // Table columns
    var place = tabletopData[num]["Place Title"];
    var submitter = tabletopData[num].submitter;
    var text = tabletopData[num]["Place Description"];
    var photoLink= tabletopData[num].Media;

    // Pull in our lat, long information
    var dataLat = tabletopData[num].Lat;
    var dataLong = tabletopData[num].Lng;

    // Add to our marker
    marker_location = new L.LatLng(dataLat, dataLong);
    // Create the marker
    layer = new L.Marker(marker_location);

    // Create the popup
    var popup = "<div class=popup_box" + "id=" + num + ">";
      if (photoLink) {
        popup += "<img src='" + photoLink + "'><br />";
      }
    popup += "<div class='popup_box_header'><strong>" + place + "</strong></div>";
    popup += text + "<br />";
    popup += "<a href='https://www.google.com/maps/dir/Current+Location/" + dataLat + "," + dataLong + "' target='_blank'><div class='getDirections'>Get Directions</div></a>";
    popup += "</div>";
    // Add to our marker
    layer.bindPopup(popup);

    // Add marker to our to map
    map.addLayer(layer);

  }
};




// Disable drag and zoom handlers.
  map.touchZoom.disable();
  map.scrollWheelZoom.disable();

// Disable tap handler, if present.
  if (map.tap) map.tap.disable();
