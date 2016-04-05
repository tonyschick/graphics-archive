var labels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
var watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
  attribution: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | Map tiles by <a href="http://stamen.com/">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
});
var terrain = L.esri.basemapLayer('Terrain');
var viewOffset = 0.2;


var map = L.map('map', {
    scrollWheelZoom: false,
    center: [47, -128],
    zoom: 6,
    zoomControl: false
});

if ( $(document).width() < 500 ) {
  map.setView([46, -121], 4);
  var viewOffset = 0;
}

map.addLayer(terrain);
map.addLayer(watercolor);
map.addLayer(labels);
watercolor.setOpacity(0.6);
new L.Control.Zoom({ position: 'topright' }).addTo(map);


var geojsonMarkerOptions = {
    radius: 7,
    fillColor: "#fff",
    color: "#fff",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

var smallIcon = new L.icon({
    iconUrl: 'bookMarker.png',
    iconSize:     [30, 41],
    iconAnchor:   [15, 41],
});


var rentalYears = L.geoJson(books, {
      pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {
                icon: smallIcon
          });
          // return L.circleMarker(latlng, geojsonMarkerOptions);

      },
      onEachFeature: function (feature, layer) {
          layer.on('click', function (e) {

            $(".infoPane").removeClass("hide");
            $(".startSlide").addClass("hide");

            // Cover Image Link	Place	Summary	Author	Page Count	First Line	Genre	City Fact
              document.getElementById("place").innerHTML = feature.properties.Place;
              document.getElementById("coverImage").src = feature.properties["Cover Image Link"];
              document.getElementById("title").innerHTML = feature.properties["Book Name"];
              document.getElementById("author").innerHTML = "By " + feature.properties.Author;
              document.getElementById("summary").innerHTML = feature.properties.Summary;
              document.getElementById("firstLine").innerHTML = feature.properties["First Line"];

          });
      }
  }).addTo(map);

  // STEPPER

      var step = 0;

      $("#go").on("click", function() {
        if (step <= books.features.length){
          step = ++step;
        }
        stepper(step);
      });

      $(".next").on("click", function() {
        if (step <= books.features.length){
          step = ++step;
        }
        stepper(step);
      });

      $(".last").on("click", function() {
        if (step >= 1){
          step = --step;
        }
        stepper(step);
      });

    function stepper(){

      if (step > 0) {
        $("#title").text(books.features[(step - 1)].properties["Book Name"]);
        $("#coverImage").attr("src", books.features[(step - 1)].properties["Cover Image Link"]);
        $("#title").text(books.features[(step - 1)].properties["Book Name"]);
        $("#author").text("By " + books.features[(step - 1)].properties.Author);
        $("#summary").text(books.features[(step - 1)].properties.Summary);
        $("#place").html(books.features[(step - 1)].properties.Place);
        $("#pageCount").html(books.features[(step - 1)].properties['Page Count']);
        $("#firstLine").text(books.features[(step - 1)].properties["First Line"]);

        // MAP ANIMATION
        map.setView([books.features[(step - 1)].properties.Lat, books.features[(step - 1)].properties.Lng],
                     books.features[(step - 1)].properties.zoomLevel,
                    // 12,
        {
             pan: {animate: false, duration: 2},
             zoom: {animate: false}
           }
         );

          //  // Calculate the offset
           var offset = map.getSize().x*viewOffset;
          //  // Then move the map
           map.panBy(new L.Point(-offset, 0), {animate: false});

      }

      switch(step) {
            case 0:
             $(".infoPane").addClass("hide");
             $(".startSlide").removeClass("hide");
             $(".last").addClass("inactive");
            //  $(".leaflet-marker-icon").css("opacity", "1");

             map.setView([46, -125], 7, {
                  pan: {animate: true, duration: 2},
                  zoom: {animate: true}
                });

             break;
            case 1:
              $(".last").removeClass("inactive");
              $(".infoPane").removeClass("hide");
              $(".startSlide").addClass("hide");
              // $(".leaflet-marker-icon").css("opacity", "1");
              break;
            case books.features.length - 1:
              $(".next").removeClass("inactive");
              break;
            case books.features.length:
              $(".next").addClass("inactive");
              break;
            }

            pymChild.sendHeight();

      };



  // Disable drag and zoom handlers.
  // map.dragging.disable();
  // map.touchZoom.disable();
  // map.doubleClickZoom.disable();
  // map.scrollWheelZoom.disable();

  // Disable tap handler, if present.
  if (map.tap) map.tap.disable();
