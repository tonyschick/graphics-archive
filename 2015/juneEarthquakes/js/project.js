var map = L.map('map').setView([44.1, -126.5], 6);

L.esri.basemapLayer('NationalGeographic').addTo(map);

function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.title) {
        layer.bindPopup(feature.properties.title);
    }
}

function getColor(d) {
    return d > 7 ? '#e31a1c' :
           d > 6 ? '#fc4e2a' :
           d > 5 ? '#fd8d3c' :
           d > 4 ? '#feb24c' :
           d > 3 ? '#fed976' :
                   '#ffffb2' ;
}


function style(feature) {
    return {
      radius: (feature.properties.mag * 1.5),
      fillColor: getColor(feature.properties.mag),
      color: "#444",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
    };
}

var firstEarthquake = L.geoJson(earthquakes, {
    onEachFeature: onEachFeature,
    filter: function (feature, layer) {
            return feature.properties.time === 1433141561400;
        },
    pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
    style: style
}).addTo(map);

var earlyEarthquakes = L.geoJson(earthquakes, {
    onEachFeature: onEachFeature,
    filter: function (feature, layer) {
            return feature.properties.time === 1433169994490 ||
                   feature.properties.time === 1433155587880 ||
                   feature.properties.time === 1433142080820;
        },
    pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
    style: style
});

var fifthEarthquakes = L.geoJson(earthquakes, {
    onEachFeature: onEachFeature,
    filter: function (feature, layer) {
            return feature.properties.title === 'M 5.9 - Off the coast of Oregon';
        },
    pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
    style: style
});

var laterEarthquakes = L.geoJson(earthquakes, {
    onEachFeature: onEachFeature,
    filter: function (feature, layer) {
            return feature.properties.time === 1433214685880 ||
                   feature.properties.time === 1433213444180;
        },
    pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
    style: style
});

var allEarthquakes = L.geoJson(earthquakes, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
    style: style
});

//  STEPPER

var step = 0;

$("#next").on("click", function() {
  if (step <= 3){
    step = ++step;
  } 
  stepper(step);
});

$("#last").on("click", function() {
  if (step >= 1){
    step = --step;
  } 
  stepper(step);
});

function stepper(){
  switch(step) {
        case 0:

         $("#stepDescription").html("Just before midnight Monday, a 5.8 magnitude earthquake hit 300 miles off the Oregon Coast about six miles underground, which is considered relatively shallow.");

         map.setView([44.1, -125], 6);

         map.removeLayer(earlyEarthquakes);

         $("#last").attr("class", "inactive");

         break;

        case 1:

          // FACT CHECK

          $("#stepDescription").html("Soon after, a 4.3 hit in the same spot. At 3:46 a.m. there was a 5.5 and a 4.4 quake at 7:46 a.m.");
          
          earlyEarthquakes.addTo(map);
          map.removeLayer(fifthEarthquakes);

          map.setView([44.553, -129.544], 9, {
            pan: {animate: true, duration: 1},
            zoom: {animate: true}
          });
          
          $("#last").attr("class", "active");

          break;

        case 2:

          $("#stepDescription").html("Then, a 5.9 magnitude earthquake struck at 1:11 p.m., the fifth quake to hit the area.");
          
          fifthEarthquakes.addTo(map);
          map.removeLayer(laterEarthquakes);

          map.setView([44.553, -129.544], 9, {
            pan: {animate: true, duration: 1},
            zoom: {animate: true}
          });
          
          $("#next").attr("class", "active");

          break;

        case 3:

          $("#stepDescription").html("The latest earthquakes occurred Monday night at 7:50 and 8:11. They registered at magnitudes 3.9 and 4.2, respectively.");
          
          laterEarthquakes.addTo(map);
          map.removeLayer(allEarthquakes);

          map.setView([44.553, -129.844], 9, {
            pan: {animate: true, duration: 1},
            zoom: {animate: true}
          });
          
          $("#next").attr("class", "active");

          break;

        case 4:

          $("#stepDescription").html("Earthquake clusters like this are actualy pretty common. Here is a look at earthquakes with a magnitude greater than 2.5 in the Northwest since Jan. 1.");

          allEarthquakes.addTo(map);

          map.setView([45.1, -123], 5);

          $("#next").attr("class", "inactive");

          break;

    }
}





//  JUNK


          // $.getJSON("http://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2015-01-01%2000:00:00&maxlatitude=49.239&minlatitude=41.574&maxlongitude=-116.06&minlongitude=-131.968&minmagnitude=0&eventtype=earthquake&endtime=2015-05-31%2023:59:59&orderby=time", function (data2) {
          //     myGeoJSONlayer.addData(data2);
          // });

// Disable drag and zoom handlers.
  map.touchZoom.disable();
  map.scrollWheelZoom.disable();

// Disable tap handler, if present.
  if (map.tap) map.tap.disable();


