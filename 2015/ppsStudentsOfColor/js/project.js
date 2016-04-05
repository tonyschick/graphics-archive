var map = L.map('map').setView([45.57, -122.75 ], 11);

var docWidth = $(document).width();

if (docWidth < 460) {
  map.setView([45.57, -122.75 ], 10);
}

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

// control that shows state info on hover
    var info = L.control();

    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };

    info.update = function (props) {

      function moreOrLess(rate){
        if (rate < 0){
          return "less";
        } if (rate > 0){
          return "more";
        } else {
          return "equally";
        }
      };

       function showMiddleSchool(x,y){
          if ( x !== y){
             return '<h5>Middle School Attendance Area</h5><p>' + props.GRADE_8_NA + ' is <strong>' + formatter(props.ms_rate) +  ' ' + moreOrLess(props.ms_rate) + '</strong> racially diverse than its attendance&nbsp;area.</p>'  
         } else {
          return ' '
         }
       };

       function formatter(x){
          if ( x < 0 || x > 0 ){
            return Math.abs(x) +  ' percent'; 
          } else {
            return '';
          }
       };


      this._div.innerHTML = (props ?
              '<h4>Attendance Area</h4><p>' +
                 props.GRADE_5_NA + ' is <strong>' + formatter(props.e_rate) + ' ' + moreOrLess(props.e_rate) + '</strong> racially diverse than its attendance&nbsp;area.</p>' 
                 + showMiddleSchool(props.GRADE_5_NA, props.GRADE_8_NA)


        : '<h4>Attendance Area</h4><p>Hover over an attendace area for information</p>');
    };

    info.addTo(map);


function getColor(d) {
    return d > 11   ? '#d73027' :
           d > 6    ? '#f46d43' :
           d > 3    ? '#fdae61' :
           d > 0    ? '#fee090' :
           d === 0  ? 'rgba(250,250,250,0.7)' :
           d > -1   ? '#e0f3f8' :
           d > -3   ? '#abd9e9' :
           d > -20  ? '#74add1' :
                     '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.e_rate),
        weight: 1,
        opacity: 1,
        // color: 'rgba(250,250,250,0)',
        fillOpacity: 0.9,
        color: 'white'

    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#fff',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

        info.update(layer.feature.properties);

}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();

}

var geojson;

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
      });
}

geojson = L.geoJson(students, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);



// Disable drag and zoom handlers.
  map.touchZoom.disable();
  map.scrollWheelZoom.disable();

// Disable tap handler, if present.
  if (map.tap) map.tap.disable();