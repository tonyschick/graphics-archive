var map = L.map('map').setView([45.55, -122.71], 12);

// ESRI OPEN TILES
  L.esri.basemapLayer('Gray').addTo(map);

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

// "planning_a": "Aber_A1", "enr_2015_1": 47, "enr_2014_1": 43, "enr_2013_1": 40, "enr_2012_1": 44, "enr_2011_1": 43, "enr_2010_1": 41, "enr_2009_1": 37, "enr_2008_0": 33, "enr_2015_2": 27, "enr_2014_2": 26, "enr_2013_2": 24, "enr_2012_2": 20, "enr_2011_2": 15, "enr_2010_2": 18, "enr_2009_2": 18, "enr_2008_1": 18, "enr_2015_3": 27, "enr_2014_3": 27, "enr_2013_3": 23, "enr_2012_3": 25, "enr_2011_3": 24, "enr_2010_3": 14, "enr_2009_3": 16, "enr_2008_2": 18,




  function getColor(d) {
      return d > 1000 ? '#800026' :
             d > 500  ? '#BD0026' :
             d > 200  ? '#E31A1C' :
             d > 100  ? '#FC4E2A' :
             d > 50   ? '#FD8D3C' :
             d > 20   ? '#FEB24C' :
             d > 10   ? '#FED976' :
                        '#FFEDA0';
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      // weight: 5,
      // color: '#666',
      // dashArray: '',
      // fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }

    info.update(layer.feature.properties);
  }

  function style(feature) {
      return {
          // fillColor: getColor(feature.properties.density),
          fillColor: "#2ca25f",
          weight: 1,
          opacity: 1,
          color: "#444",
          // dashArray: '3',
          fillOpacity: 0.7
      };
  }

  var info = L.control();

  info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
  };


// "Current_Gr": "Abernethy", "Current__1": "Hosford", "Current__2": "Cleveland", "Scenario1_": "Creston", "Scenario11": "Kellogg", "Scenario_1": "Franklin", "Scenario2_": "Creston", "Scenario21": "Hosford", "Scenario_2": "Cleveland", "ESRI_OID": 1 }

  info.update = function (props) {
      this._div.innerHTML = (props ?
           props.planning_a + '<br />' +
           '<h2>Current System</h2>' +
           '<b>Grade School: </b>' + props.Current_Gr + '<br />' +
           '<b>Middle School: </b>' + props.Current__1 + '<br />' +
           '<b>High School: </b>' + props.Current__2 + '<br />' +
           '<h2>Scenario 1</h2>' +
           '<b>Grade School: </b>' + props.Scenario1_ + '<br />' +
           '<b>Middle School: </b>' + props.Scenario11 + '<br />' +
           '<b>High School: </b>' + props.Scenario_1 + '<br />' +
           '<h2>Scenario 2</h2>' +
           '<b>Grade School: </b>' + props.Scenario2_ + '<br />' +
           '<b>Middle School: </b>' + props.Scenario21 + '<br />' +
           '<b>High School: </b>' + props.Scenario_2

          : 'Hover over a block');
  };

  info.addTo(map);


  function resetHighlight(e) {

      info.update();
  }

  function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
      layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
      });
  }


  L.geoJson(schoolblocks, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

// Disable drag and zoom handlers.
  map.touchZoom.disable();
  map.scrollWheelZoom.disable();

// Disable tap handler, if present.
  if (map.tap) map.tap.disable();
