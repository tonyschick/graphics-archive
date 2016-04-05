// grab the width of our body and store it in a variable
var width = $( "body" ).width();


// if it's a wide page, zoom it in further
if(width <= 800){
    theZoom = 6
}
else{
    theZoom = 7
}

// load the leaflet map, center it over Oregon and zoom it accordingly
var map = L.map('map').setView([44.1, -120.5], theZoom);

// disable annoying scroll/zoom features
map.touchZoom.disable();
map.scrollWheelZoom.disable();

// add in a beautiful tile layer courtesy of CartoDB
var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

layer.addTo(map);


// function that set the color of the bridge icon according to its status
function getColor(d) {
    return d == 'Potentially Seismically Vulnerable' ? '#fed976' :
           d == 'Seismically Vulnerable' ? '#fc4e2a' :
                      '#CCC';
}

// function that sets an overall style for the bridge icon, using our color function
function bridgeStyle(feature) {
    return {
      radius: 5,
      weight: 0.5,
      opacity: .95,
      color: 'black',
      // dashArray: '3',
      fillOpacity: 0.90,
      fillColor: getColor(feature.properties.Description)
    };
}

// function that generates a popup for each marker and loads in the necessary data
function onEachFeature(feature, layer) {
      var popupContent =  "<p class=popuptext><b>Description:</b> " +
          feature.properties.STRUCNAME  + "</p>" + "<p><b>Built in " + feature.properties.YEARBUILT + "</b>, it is " + Math.round(feature.properties.LENGTH_ft) + " feet long and crosses " + feature.properties.Crosses + ". It was rated " + feature.properties.Description + "." ;

      layer.bindPopup(popupContent.toUpperCase());
}

// load in the bridges and call our functions
L.geoJson(bridges, {
    style: bridgeStyle,
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    }

}).addTo(map);

// create a legend and put it in the top right of the page 
var info = L.control({ collapsed: true, position: 'topright' });

// add a div within that legend on map load
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

// add in some divs with our legend and disclaimer
info.update = function (legendstuff) {
    this._div.innerHTML = '' +  (legendstuff ?
        ""
        : '<p><h3>ABOUT</h3><div id="disclaimertext"><div class="vulnerable"></div> Seismically vulnerable <br /><div class="potentiallyvulnerable"></div> Potentially seismically vulnerable </p><p>This data was developed by the Oregon Department of Transportation Bridge Section based on a system-wide automated assessment of bridges based on the existence of typical vulnerable details, age and predicted seismic ground motions for a 9.0 Cascadia Subduction Zone earthquake. Detailed seismic analysis has not been conducted to support these potential performance estimates. The seismic vulnerability assessment was developed for bridges carrying the proposed seismic lifeline routes only.</div></p>');
};

// add the legend to the map
info.addTo(map);

// if the page is wide, show the legend, if not hide it
if(width <= 800){
$( "#disclaimertext" ).hide();
}
else{
}

// show/hide the full legend on click or touch
$(".info").click(function() {
$( "#disclaimertext" ).toggle();
});

