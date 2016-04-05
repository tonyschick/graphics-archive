var width = $( "body" ).width();

// if it's a wide page, zoom it in further
if(width <= 650){
    var popupBottom = "250px",
        popupLeft = "150px"
}
else{
    var popupBottom = "85px",
        popupLeft = "50px"
}



var map = L.map('map', {maxZoom: 19, minZoom: 9, }).setView([45.563791, -122.733205], 13);
// L.esri.basemapLayer('Gray', {maxNativeZoom: 16}).addTo(map);

// Disable drag and zoom handlers.
  map.touchZoom.disable();
  map.scrollWheelZoom.disable();
  map.doubleClickZoom.disable();
  map.dragging.disable();

$(".leaflet-control-zoom").hide();

// var zoomer = L.control.zoom( {position: "topright"} )


// Disable tap handler, if present.
  if (map.tap) map.tap.disable();


$("#map").hide();

// Historic Imagery
var options = {
    minZoom: 9,
    maxZoom: 14,
    opacity: 1.0,
    tms: false
};

var historicMaps = new L.LayerGroup(),
    TopoLayer = new L.LayerGroup()
    StamenLayer = new L.LayerGroup();

L.tileLayer('tiles/historic_portland/{z}/{x}/{y}.png', options).addTo(historicMaps);
L.tileLayer('tiles/historic_hillsboro/{z}/{x}/{y}.png', options).addTo(historicMaps);

// L.esri.basemapLayer('NationalGeographic', {maxNativeZoom: 16}).addTo(TopoLayer);
// L.tileLayer('http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png').addTo(StamenLayer);

var layer =  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});


// layer = L.esri.basemapLayer('Imagery', {maxNativeZoom: 16}) //.addTo(TopoLayer);



// Define some layer groups for our various geojson files
var tanklayer = new L.LayerGroup(),
    liquefactionlayer = new L.LayerGroup()
    footprintlayer = new L.LayerGroup();


// MAKE THE LIQUEFACTION LAYER
var liquefactionStyle = {
  fillColor: 'red',
  fillOpacity: 0.15,
  color: 'red',
  opacity: .15,
  weight: 0
};

L.geoJson(liquefaction, {
   style: liquefactionStyle,
     onEachFeature: function (feature, layer) {
     },
}).addTo(liquefactionlayer);


// MAKE THE BUILDING FOOTPRINT LAYER
var footprintStyle = {
  fillOpacity: 1,
  fillColor: '#333',
  color: '#333',
  opacity: 1,
  weight: 1
};

L.geoJson(footprint, {
  style: footprintStyle
}).addTo(footprintlayer)

// LEGEND

  var info = L.control({ collapsed: false, position: 'bottomright' });

  info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
  };

  info.update = function (legendstuff) {
      this._div.innerHTML = '' +  (legendstuff ?
          ""
          : '<div id="collapse-stepper"><i class="fa fa-bars"></i></div><span class="legend-about">LEGEND</span><div id="infoContent"></div>');
  };

  info.addTo(map);



if(width <= 650){
}
else{
  $(".legend-about").hide();
}



var controller = L.control.layers(
  {
	},
	{
		'View historic maps': historicMaps,
}, { collapsed: false, position: 'bottomright'}
)





// MAKE THE TANK LAYER
function getColor(d) {
    return d >= 2010 ? '#ffffb2' :
           d >= 2004 ? '#fed976' :
           d >= 1993  ? '#feb24c' :
           d >= 1990  ? '#fd8d3c' :
           d >= 1972  ? '#fc4e2a' :
           d >= 1956  ? '#f03b20' :
           d <  1956  ? '#bd0026' :
                      '#CCC';
}

function tankStyle(feature) {

  // If the tank is out of service, don't fill it with a color
  if(feature.properties.Substance == "Out of service"){

    return {
      weight: 0.5,
      opacity: 1,
      color: 'black',
      dashArray: '3',
      fillOpacity: 0,
      // fillColor: getColor(feature.properties.Year, feature.properties.Substance)
    };

  }

  // Otherwise, fill it with one of the colors above based on its year of construction
  else{

    return {
      weight: 0.5,
      opacity: 1,
      color: 'gray',
      fillOpacity: 0.5,
      fillColor: getColor(feature.properties.Year)
    };

  }

}

var highlightStyle = {
// Currently no change to tank style on hover
};


/*********** Beautiful functionality for geojson layer hover popups, taken from Palewire. ******/
// GEOJSON STYLE
var onEachFeature = function(feature, layer) {
    // Load the default style.
    layer.setStyle(tankStyle);
    // Create a self-invoking function that passes in the layer
    // and the properties associated with this particular record.
    (function(layer, properties) {
      // Create a mouseover event
      layer.on("mouseover", function (e) {
        // Change the style to the highlighted version
        layer.setStyle(highlightStyle);
        // Create a popup with a unique ID linked to this record
        var popup = $("<div></div>", {
            id: "popup-" + properties.TANK_ID,
            css: {
                position: "absolute",
                bottom: popupBottom,
                left: popupLeft,
                zIndex: 1002,
                minWidth: "195px",
                // width: "395px",
                borderRadius: "5px",
                backgroundColor: "#333",
                color: "white",
                padding: "8px",
            }
        });
        // Insert a headline into that popup
        var owner = $("<p></p>", {
            text: "Owner: " + properties.Owner,
            css: {fontSize: "16px", marginBottom: "3px"}
        }).appendTo(popup);
        var capacity = $("<p></p>", {
            text: "Capacity: " + properties.Max_Capaci + " gallons",
            css: {fontSize: "16px", marginBottom: "3px"}
        }).appendTo(popup);
        var substance = $("<p></p>", {
            text: "Substance: " + properties.Substance,
            css: {fontSize: "16px", marginBottom: "3px"}
        }).appendTo(popup);
        var yearbuilt = $("<p></p>", {
            text: "Year built: " + properties.Year,
            css: {fontSize: "16px", marginBottom: "3px"}
        }).appendTo(popup);

        // Add the popup to the map
        popup.appendTo("#map");
      });
      // Create a mouseout event that undoes the mouseover changes
      layer.on("mouseout", function (e) {
        // Start by reverting the style back
        layer.setStyle(tankStyle);
        // And then destroying the popup
        $("#popup-" + properties.TANK_ID).remove();
      });
      // Close the "anonymous" wrapper function, and call it while passing
      // in the variables necessary to make the events work the way we want.
    })(layer, feature.properties);
};


function resetHighlight(e) {
	liquefactionlayer.resetStyle(e.target);
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds(), {maxZoom: 16});
}

L.geoJson(tanks, {
     style: tankStyle,
     onEachFeature: onEachFeature,
}).addTo(tanklayer);


/******* BASE LAYER OPTIONS FOR ESRI LEAFLET ************/
  // Topographic
  // Streets
  // National Geographic
  // Oceans
  // Gray
  // Dark Gray
  // Imagery
  // Shaded Relief


/******** STASH OF OF BASE MAP POTENTIALS **************/
// OPEN STREET MAP BASE TILE
  // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

// MAP QUEST OPEN TILES
  // L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {maxZoom: 19}).addTo(map);
  // L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png').addTo(map);

// STAMEN
  // L.tileLayer('http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png').addTo(map);
  //L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.png', {maxZoom: 19}).addTo(map);
  // L.tileLayer('http://tile.stamen.com/watercolor/{z}/{x}/{y}.png').addTo(map);
/********************************************************/



$("#collapse-stepper").click(function() {
  $( "#infoContent" ).toggle();
  // $( "#buttonContainer").toggle();
});



// STEPPER

    var step = 0;

    $("#next").click(function() {
      if (step <= 4){
        step = ++step;
      }
      stepper(step);
    });

    $("#last").click(function() {
      if (step >= 1){
        step = --step;
      }
      stepper(step);
    });

  function stepper(){

    // var bgOpacity = 0.10;

    switch(step) {
          case 0: // START PAGE

            $("#vidcontainer").show();
            $("#map").hide();

          	$("#last").attr("class", "inactive");

            map.removeLayer(historicMaps);

            $("#stepDescription").html('Have you heard a Cascadia Subduction Zone earthquake could leave you without fuel for over a month? Here\'s why: This six-mile stretch along the Willamette River in Portland is a critical hub for Oregon\'s fuel and energy. It\'s also one of the more seismically vulnerable spots in the city.');



           break;

          case 1: // WAS WATER

            $("#vidcontainer").hide();

            $("#map").show();

          	// add map of Portland
            historicMaps.addTo(map);

          	$("#stepDescription").html("<b>Some of NW Portland used to be water. </b>Much of the land along the Willamette River in Northwest Portland used to be lakes, marsh and parts of the river. Take a look at Guild Lake, Kittredge Lake and the marshy areas along the West bank of the river.");


          	$("#last").attr("class", "active");

            $(".info").hide();

          	//L.esri.basemapLayer('Imagery', {maxNativeZoom: 16}).removeFrom(map);


            break;

          case 2: // FILLED IN
          	$("#stepDescription").html("<b>It now looks like this. </b>Those lakes and marshes were filled in during the early part of the 20th century, and much of Northwest Portland's commercial and industrial areas were built on those dredge spoils, which offered prime access to a shipping channel.");


          	// Switching to current basemap
            map.removeLayer(historicMaps);
            map.removeLayer(footprintlayer);

            map.addLayer(layer);

            // Remove and then add, to avoid duplication in case people move in reverse
            // controller.removeFrom(map);

            // controller.addTo(map);

            $(".info").hide();


            break;

          case 3: // INFRASTRUCTURE


          	$("#stepDescription").html("<b>It has become a key hub for fuel and energy. </b>Rail lines, marine terminals, fuel tanks, substations, pipelines and transmission lines built up over the decades. Currently, more than 90 percent of Oregon's fuel supply (think gasoline, diesel or jet fuel) comes through this this hub along the river.");
          	// Add in infrastructure: tanks and pipelines

            $(".info").show();
            $("#infoContent").empty();

            $("#infoContent").html('<div class="footprintblob"></div> Building footprint <br />');

            footprintlayer.addTo(map);

            map.removeLayer(liquefactionlayer);

            break;

          case 4: // LIQUEFACTION

          	$("#stepDescription").html("<b>But there's the problem. </b>Scientists now know those soils have the potential for liquefaction. That means in the event of a Cascadia earthquake, the soils could become permeated with water, giving them the consistency of a sandy pudding. If that happens, it can damage buildings, tanks and pipes.");

            $("#infoContent").empty();

            $("#infoContent").html('<div class="footprintblob"></div> Building footprint<br /><div class="liquefactionblob"></div> Liquefaction potential');

            // add liquefaction polygon
          	liquefactionlayer.addTo(map);

            // remove and re-add footprint layer, so we can re-add it if people move in reverse
            map.removeLayer(footprintlayer);
            footprintlayer.addTo(map);

            // remove the tank layer when people move in reverse

            map.removeLayer(tanklayer);

            map.setZoom(13);


            map.doubleClickZoom.disable();
            map.dragging.disable();

            $(".legend-about").hide();
            $(".leaflet-control-zoom").hide();


          	// Highlight liquefaction and shaking risks
          	$("#next").attr("class", "active");

            break;

          case 5: // TANK DETAILS

            map.removeLayer(TopoLayer);
            StamenLayer.addTo(map);
            // L.esri.basemapLayer("NationalGeographic").addTo(map);

            // $("#collapse-stepper").show();
            $("#next").attr("class", "inactive");

          	$("#stepDescription").html("<b>And the infrastructure is old. </b>Many of the tanks are decades old and built before stricter seismic codes, increasing the risk that one or more could fail in an earthquake. Click on a facility name and hover over a tanks to see age, capacity and contents. Tanks are colored according to the date of construction and sized approximately to scale.");

            $("#infoContent").empty();

            $("#infoContent").html('<br/><p class="artnote">Year built: <br/><span style="background:#ffffb2;"></span><span style="background:#fed976;"></span><span style="background:#feb24c;"></span><span style="background:#fd8d3c;"></span><span style="background:#fc4e2a;"></span><span style="background:#f03b20;"></span><span style="background:#bd0026;"></span><span style="background:#ccc;"></span><span style="border: 1px dashed black; margin-left: 2px;"></span><br/><label><2010</label><label><2004</label><label><1993</label><label><1990</label><label><1972</label><label><1956</label><label>Earlier</label><label>Unk</label><label>Unused</label></p><p class="artnote">These years represent significant seismic upgrades in the Oregon building code. Generally, newer tanks are more likely to withstand a major earthquake.</label><br /><br/>Map shows facilities for which OPB was able to obtain data from state regulators. Click to view a facility:<br/><div class="tankbutton" id="bp">BP</div><div class="tankbutton" id="chevron">Chevron</div><div class="tankbutton" id="kml">Kinder Morgan (Linnton)</div><div class="tankbutton" id="kmw">Kinder Morgan (Willbridge)</div><div class="tankbutton" id="mccall">McCall Oil</div><div class="tankbutton" id="nustar">NuStar</div><div class="tankbutton" id="pacific">Pacific Terminals</div><div class="tankbutton" id="phillips">Phillips 66</div>');


            if(width <= 800){
              $("#infoContent").hide();
            }
            else{

            }

            $(".legend-about").show();
            $(".leaflet-control-zoom").show();

            map.doubleClickZoom.enable();
            map.dragging.enable();


            map.removeLayer(liquefactionlayer);
            map.removeLayer(footprintlayer);

            tanklayer.addTo(map);

            var tankzoom = 17;
            map.setView([45.56359, -122.74019], tankzoom -1);

            // change center and zoom based on selection of facility
            $("#chevron").click(function() {
              map.setView([45.564239, -122.741771], tankzoom);
              map.panBy([100, 100]);
            });
            $("#bp").click(function() {
              map.setView([45.594185, -122.779921], tankzoom);
              map.panBy([100, 100]);

            });
            $("#mccall").click(function() {
              map.setView([45.563878, -122.735130], tankzoom);
              map.panBy([100, 100]);
            });
            $("#kml").click(function() {
              map.setView([45.602927, -122.786861], tankzoom);
              map.panBy([100, 100]);
            });
            $("#kmw").click(function() {
              map.setView([45.566673, -122.745076], tankzoom);
              map.panBy([100, 100]);
            });
            $("#nustar").click(function() {
              map.setView([45.589301, -122.773987], tankzoom);
              map.panBy([100, 100]);
            });
            $("#pacific").click(function() {
              map.setView([45.579370, -122.761259], tankzoom);
              map.panBy([100, 100]);
            });
            $("#phillips").click(function() {
              map.setView([45.562586, -122.740473], tankzoom);
              map.panBy([100, 100]);

            });


            break;
          }

      }
