var map = L.map('map').setView([45, -120.5], 6);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.light'
  }).addTo(map);


  // control that shows state info on hover
  var info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (props) {
    this._div.innerHTML = (props ?
        '<h4>' + props.instName + '</h4>'
        // + 'Persons On SNAP: <strong>'+ numberWithCommas(Math.round(props.snapdata_N3)) + '</strong></br>'
        + 'Population: <strong>' +  numberWithCommas(props.snapdata_N4)  + '</strong></br>'
        + 'Average Monthly SNAP Participants: <strong>' + numberWithCommas(Math.round(props.snapdata_N3))  + '</strong></br>'
        + 'Percent of Population: <strong>' + Math.round(((props.snapdata_N3 / props.snapdata_N4).toFixed(2)) * 100) + '%</strong></br>'


        // averageMonthlySNAPparticipants
        :
        '<h4>Oregon</h4>'
        + 'Population: <strong>3,826,398</strong></br>'
        + 'Average Monthly SNAP Participants:  <strong>762,394</strong></br>'
        + 'Percent of Population: <strong>' + Math.round((( 762394 / 3826398 ).toFixed(2)) * 100) + '%</strong></br>'
        );
  };

  info.addTo(map);


  function getColor(d) {
      return d > 0.26 ? '#b30000' :
             d > 0.21 ? '#e34a33' :
             d > 0.16 ? '#fc8d59' :
             d > 0.11 ? '#fdcc8a' :
                         '#ffffff' ;
  }


  function style(feature) {
    return {
      weight: 1,
      opacity: 1,
      color: '#222',
      // dashArray: '3',
      fillOpacity: 0.9,
      fillColor: getColor(feature.properties.snapdata_N3 / feature.properties.snapdata_N4)
    };
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 2,
      color: '#222',
      // dashArray: '',
      fillOpacity: 0.9
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }

    info.update(layer.feature.properties);
  }

  var geojson;

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
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

  geojson = L.geoJson(snap, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

  // COMMA
  function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
