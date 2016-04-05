var width = $( "body" ).width();

// if it's a wide page, zoom it in further
if(width <= 490){

  TheZoom = 5
  TheLatLng = [44.75, -120.8]

}

else if (width >= 900) {
   TheZoom = 7
   TheLatLng = [47.75, -119.8]
}

else {
   TheZoom = 6
   TheLatLng = [47.75, -118.8]

}


var map = L.map('map', {zoomControl:false, attributionControl: false}).setView(TheLatLng, TheZoom);

var legend = L.control({position: 'bottomright'}); 

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 500, 1000, 5000, 10000, 25000, 50000],
        labels = [];
        div.innerHTML = '<b>Potential acres affected</b><br/>'

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + ( grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);


function getColor(d) {
    return d > 40000 ? '#08589e' :
           d > 20000  ? '#2b8cbe' :
           d > 10000  ? '#4eb3d3' :
           d > 5000  ? '#7bccc4' :
           d > 1000   ? '#a8ddb5' :
           d > 500  ? '#ccebc5' :
                      '#e0f3db';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.acres),
        weight: 0.5,
        opacity: 1,
        color: 'gray',
        dashArray: '2',
        fillOpacity: 0.7
    };
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function onEachFeature(feature, layer) {

// var popup = L.popup({autoPan: false})
//     .setLatLng(47.1, -118.8)
//     .setContent("<p><b>" + feature.properties.NAME + " County</b>" + "<br />" + numberWithCommas(feature.properties.acres) + " acres potentially affected.</p>");

//   // if (feature.properties && feature.properties.popupContent) {
//   //   popupContent += feature.properties.popupContent;
//   // }
//   layer.bindPopup(popup);


layer.on('click', function (e) {
    document.getElementById("info").innerHTML = ("<p><b>" + feature.properties.NAME + " County</b>" + "<br />" + numberWithCommas(feature.properties.acres) + " acres</p>");
    // $("#feature_infos").stop();
    // $("#feature_infos").fadeIn("slow");
    // $("#feature_infos").fadeOut(5000);

});

}





L.geoJson(acres, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);

// Disable drag and zoom handlers.
  map.touchZoom.disable();
  map.scrollWheelZoom.disable();
  map.dragging.disable();

// Disable tap handler, if present.
  if (map.tap) map.tap.disable();


