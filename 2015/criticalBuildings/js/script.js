$( document ).ready(function() {

	$("#about_button").click(function(){
        $("#about").toggle();
        $("#about").css("visibility", "visible");
        // $("#embedInfoPane").hide();
        // $('#dataInfo').toggleClass("buttonSelected");
      });

	$('#city_selection').keydown(function(event){    
	    if(event.keyCode==13){
	       $('#buildings-search').trigger('click');
	       return false;	
	    }
	});

	/***********************************************************************************************************************************/
	/*** LEAFLET PIP PLUGIN ***/
	/***********************************************************************************************************************************/

	/***********************************************************************************************************************************/
	/*** ESTABLISHING SOME GLOBAL VARIABLES ***/
	/***********************************************************************************************************************************/

	var map
	var city_list = ["Adams", "Adrian", "Agness", "Albany", "Aloha", "Alsea", "Alvadore", "Amity", "Arlington", "Ashland", "Astoria", "Athena", "Aumsville", "Aurora", "Azalea", "Baker City", "Bandon", "Banks", "Bay City", "Beaver", "Beavercreek", "Beaverton", "Bend", "Blachly", "Blaine", "Blue River", "Bly", "Boardman", "Bonanza", "Boring", "Brightwood", "Brookings", "Brooks", "Brownsville", "Burns", "Butte Falls", "Buxton", "Camas Valley", "Canby", "Cannon Beach", "Canyon City", "Canyonville", "Carlton", "Cascade Locks", "Cascadia", "Cave Junction", "Central Point", "Chiloquin", "Christmas Valley", "Clackamas", "Clatskanie", "Cloverdale", "Coburg", "Colton", "Columbia City", "Condon", "Coos Bay", "Coquille", "Corbett", "Cornelius", "Corvallis", "Cottage Grove", "Cove", "Crabtree", "Crane", "Crawfordsville", "Crescent", "Crescent Lake", "Creswell", "Culver", "Curtin", "Dallas", "Damascus", "Days Creek", "Dayton", "Dayville", "Deadwood", "Deer Island", "Detroit", "Dexter", "Diamond Lake", "Donald", "Drain", "Dufur", "Dundee", "Eagle Creek", "Eagle Point", "Echo", "Eddyville", "Elgin", "Elkton", "Elmira", "Enterprise", "Estacada", "Eugene", "Fairview", "Falls City", "Florence", "Forest Grove", "Fossil", "Gales Creek", "Gardiner", "Garibaldi", "Gaston", "Gates", "Gearhart", "Gervais", "Gilchrist", "Gladstone", "Glendale", "Gleneden Beach", "Glide", "Goble", "Gold Beach", "Gold Hill", "Government Camp", "Grand Ronde", "Grants Pass", "Grass Valley", "Gresham", "Haines", "Halfway", "Halsey", "Harrisburg", "Helix", "Heppner", "Hermiston", "Hillsboro", "Hines", "Hood River", "Hubbard", "Huntington", "Imbler", "Independence", "Ione", "Irrigon", "Island City", "Jacksonville", "Jasper", "Jefferson", "John Day", "Jordan Valley", "Joseph", "Junction City", "Keizer", "Keno", "King City", "Klamath Falls", "Knappa", "La Grande", "La Pine", "Lafayette", "Lake Oswego", "Lakeside", "Lakeview", "Langlois", "Leaburg", "Lebanon", "Lexington", "Lincoln City", "Logsden", "Long Creek", "Lorane", "Lostine", "Lowell", "Lyons", "Madras", "Malin", "Manzanita", "Mapleton", "Marcola", "Maupin", "Mckenzie Bridge", "McMinnville", "Medford", "Merrill", "Mill City", "Millersburg", "Milton-Freewater", "Milwaukie", "Mitchell", "Molalla", "Monmouth", "Monroe", "Monument", "Moro", "Mosier", "Mount Angel", "Mount Hood Parkdale", "Mount Vernon", "Mulino", "Myrtle Creek", "Myrtle Point", "Nehalem", "Neskowin", "Netarts", "Newberg", "Newport", "North Bend", "North Plains", "North Powder", "Nyssa", "Oakland", "Oakridge", "Oceanside", "Odell", "Ontario", "Oregon City", "Otis", "Pacific City", "Paisley", "Parkdale", "Pendleton", "Philomath", "Phoenix", "Pilot Rock", "Pistol River", "Pleasant Hill", "Port Orford", "Portland", "Powell Butte", "Powers", "Prairie City", "Prineville", "Prospect", "Rainier", "Redmond", "Reedsport", "Richland", "Riddle", "Rockaway", "Rockaway Beach", "Rogue River", "Rose Lodge", "Roseburg", "Rufus", "Salem", "Sandlake", "Sandy", "Santiam", "Scappoose", "Scio", "Scotts Mills", "Scottsburg", "Seal Rock", "Seaside", "Seneca", "Shady Cove", "Shedd", "Sheridan", "Sherwood", "Siletz", "Silver Lake", "Silverton", "Sisters", "Sixes", "Spray", "Springfield", "St Helens", "St Paul", "Stanfield", "Stayton", "Sublimity", "Summerville", "Sumpter", "Sunriver", "Sutherlin", "Sweet Home", "Swisshome", "Talent", "Tangent", "Tenmile", "Terrebonne", "The Dalles", "Tigard", "Tillamook", "Tiller", "Timber", "Toledo", "Trail", "Troutdale", "Tualatin", "Turner", "Tygh Valley", "Umatilla", "Umpqua", "Union", "Unity", "Vale", "Veneta", "Vernonia", "Vida", "Waldport", "Wallowa", "Walton", "Warm Springs", "Warren", "Warrenton", "Wasco", "Welches", "West Linn", "Westfir", "Westlake", "Weston", "White City", "Willamina", "Williams", "Wilsonville", "Winchester", "Winchester Bay", "Winston", "Wolf Creek", "Woodburn", "Yachats", "Yamhill", "Yoncalla"]

	var SearchLat
	var SearchLng

	var buildings_layer = L.layerGroup()
		nearby_layer = L.layerGroup()
		tsunami_layer = L.layerGroup()
		liquifaction_layer = L.layerGroup()
		shaking_layer = L.layerGroup()
		marker_layer = L.layerGroup();

	var defaultColor = "#666"
		lowColor = "#a2cc61"
		moderateColor = "#FFF79A"
		highColor = "#f25e0d"
		veryhighColor = "#e43611"


		//define a function that assigns colors to our map markers based on a property
		//within the data. In this case it is "collapse potential"
		function style(feature) {
	        switch (feature.properties.Collapse_Potential) {
				case 'Very High (100%)': return {fillColor: veryhighColor, color: veryhighColor};
	            case 'High (>10%)': return {fillColor: highColor, color: highColor};
	            case 'Moderate (>1%)': return {fillColor: moderateColor, color: moderateColor};
	            case 'Low (<1%)':   return {fillColor: lowColor, color: lowColor};
	            default: return {fillColor: defaultColor, color: defaultColor}
	       		}
	    	}

	    // define a function we'll call over and over when we add data to the map
		// it binds a popup window with relevant data to each marker. 
		function onEachFeature(feature, layer) {
	    // does this feature have a property named popupContent?
	        layer.bindPopup("<p style='font-size: 10pt'>" + feature.properties.Site_Type + "<br/><b>Building site: </b>" + "<a href='" + feature.properties.hyperli + "' targert='_blank'>" + feature.properties.Name + "</a><hr/><b>Collapose potential: </b>" + feature.properties.Collapse_Potential + "<br/><b>Level of seismic activity: </b>" + feature.properties.Seismicity + " <hr/><b>Built:</b> " +  (feature.properties.Built ? feature.properties.Built : "unknown") + "</p>");
		}

		//define how markers are going to look when they're rendered from geojson
		var geojsonMarkerOptions = {
		    radius: 4,
		    fillColor: "#ff7800",
		    //color: "#000",
		    weight: 1,
		    opacity: 1,
		    fillOpacity: 0.75
		};

	/***********************************************************************************************************************************/
	/*** IF USER CLICKS "EXPLORE MAP" ***/
	/***********************************************************************************************************************************/

	$("#MapEntry").click(function(){

		$("#nav").css("visibility", "visible");

		$(".container").css("background-image", "none");
		$("#locate-container").empty();
		$("#map-container").append('<div id="map"></div>')
		$("#map").width("100%")
		$("#map").height("300px")

		$("#map-container").append("<div id='map-legend'></div>");

		// $("#map-legend").append('<div class="row"><button class="small-3 button tiny" onclick="refreshIframe();"><i class="fa fa-refresh" style="color: #fff; cursor: pointer; float: left; margin-right: 4px;"></i>Restart</button></div>')
		// $("#map-legend").append('<div class="row"><button class="small-3 button tiny" onclick="refreshIframe();"><i class="fa fa-location-arrow" style="color: #fff; cursor: pointer; float: left; margin-right: 4px;"></i>Find me</button></div>')

		// $("#map-legend").append('<h3>What\'s my risk?</h3>')


		// <div id="backnav" class="span4 columns">hi</div>
		// <div id="controls" class="span4 columns">hi</div>
		// <div id="mapkey" class="span4 columns">hi</div>


		// Using leaflet, generate a map inside the div with the id of "map"
		var map = L.map('map').setView([45.5200, -122.6819], 10);
		map.scrollWheelZoom.disable();

		var info = L.control({ collapsed: false });
	    info.onAdd = function (map) {
	          this._div = L.DomUtil.create('div', 'info');
	          this.update();
	          return this._div;
	    };
	    info.update = function () { this._div.innerHTML = '<div id="info-contents"><div class="tsunami"></div>Tsunami zone<br/></div>' };
	    info.addTo(map);

		// Using the Esri plugin for Leaflet, add baselayers and labels to map
		L.esri.basemapLayer("Gray").addTo(map);
		L.esri.basemapLayer("GrayLabels").addTo(map);

		// Add our tsunami layer from a geojson file stored on our server
	    L.geoJson(tsunami, {
	     style: function () {
	        return { fillColor: "#F2DA00", fillOpacity: 0.75, color: "none", weight: 2, dashArray: '6' };
	      }
	    }).addTo(tsunami_layer);
		
		// Create a leaflet control. These key-value pairs appear as radio buttons within leaflet
		var control = L.control.layers({
	        "Expected shaking": shaking_layer,
	        "Liquified soil potential": liquifaction_layer,
	        "Tsunami zone": tsunami_layer
	      },
	      {
			
	      }, { collapsed: false })//.addTo(map);

		// add our control to the map
		control._map = map;
		var controlDiv = control.onAdd(map);

		// but render it into a div outside the map
		document.getElementById('map-legend').appendChild(controlDiv);





	    /********************************************************************************************************************/
		/*** ADD ALL DATA TO MAP ***/
		/********************************************************************************************************************/

		L.geoJson(buildings, {
		    pointToLayer: function (feature, latlng) {
		        return L.circleMarker(latlng, geojsonMarkerOptions);
		    },
		    style: style,
				onEachFeature: onEachFeature
		}).addTo(buildings_layer);

		buildings_layer.addTo(map);


		});

	/********************************************************************************************************************/
	/*** MODELS ***/
	/********************************************************************************************************************/

	BuildingModel = Backbone.Model.extend({
		idAttribute: "Site_UniqueID",
	});

	BuildingCollection = Backbone.Collection.extend({
	  model: BuildingModel
	});

	allbuildings = new BuildingCollection();

	/*******************************************************************************************************************/
	/*** VIEWS ***/
	/*******************************************************************************************************************/

	var BuildingView = Backbone.View.extend({
		tagName: 'tr',
		template: _.template($('#buildings-template').html()),
		render: function(){
			this.$el.html( this.template(this.model.toJSON()));
			return this;
		}
	})

	var SelectedBuildingsView = Backbone.View.extend({
		tagName: 'tbody',
		// id: 'left-select-value',
	    render: function(){
	        this.collection.each(function(critical_building){
	            var buildingView = new BuildingView({ model: critical_building });
	            this.$el.append(buildingView.render().el); // calling render method manually..
	        }, this);
	        return this; // returning this for chaining..
	    }
	})

	/******************************************************************************************************/
	/*** IF USER CLICKS "FIND ME" ***/
	/******************************************************************************************************/
	
	$("#LocateMe").click(function() {

		$("#nav").css("visibility", "visible");
		$(".container").css("background-image", "none");
		$("#locate-container").toggle().css("margin-top", "0px");
		$("#buildings-container").css("visibility", "visible");
		$("#buildings-container").css("display", "block");
		// $("#building-map").append(box)
		$("#building-map").append('<div id="map"></div>')
		$("#map").empty();

		var startPos
		 
		var geoSuccess = function(position) {
		  	startPos = position;			    
			    SearchLat = startPos.coords.latitude
			    SearchLng = startPos.coords.longitude
		 
		  	console.log(SearchLat)
		  	console.log(SearchLng)

		var map = L.map('map').setView([SearchLat, SearchLng], 11);



	  	map.removeLayer(buildings_layer);

		// Using the Esri plugin for Leaflet, add baselayers and labels to map
		L.esri.basemapLayer("Gray").addTo(map);
		L.esri.basemapLayer("GrayLabels").addTo(map);

		// Add our tsunami layer from a geojson file stored on our server
	    var tsunami_geojson = L.geoJson(tsunami, {
	     style: function () {
	        return { fillColor: "#F2DA00", fillOpacity: 0.75, color: "none", weight: 2, dashArray: '6' };
	      }
	    }).addTo(map).bindPopup('Tsunami zone');


		  	var selectedbuildingsView = new SelectedBuildingsView({ collection: allbuildings });
			//filter probably isn't the best tool here but it works like a champ
			var with_distances = _.filter(buildings, function(x, y){
				
				//create a variables with the latlng of the object 
				var latlng_test = new L.LatLng(x.geometry.coordinates[0], x.geometry.coordinates[1])	
				//create a variables with the latlng of the user 
				var latlng_test2 = new L.LatLng(SearchLng, SearchLat)
				//calculate the distance between the two coordinates using Leaflet.js plugin 
				distance = latlng_test.distanceTo(latlng_test2)
				//create an object out of it
				new_distance = {"distance": distance}
				//feed that object into our existing json properties
				$.extend(x.properties, new_distance);
				//and finally return to us the new json with distance
				return x

		    });

				// Return things within a calculated distance of 5 miles or less (measured in meters).
				nearby_filter = _.filter(with_distances, function(x,y){
					return x.properties.distance <= 8046.72
				});

				marker_layer.clearLayers()
				var your_marker = new L.marker([SearchLat, SearchLng]).addTo(marker_layer);
				marker_layer.addTo(map);

				map.removeLayer(nearby_layer)
				nearby_layer.clearLayers()

				// map.setView([SearchLat, SearchLng], 11);

				L.geoJson(nearby_filter, {
				    pointToLayer: function (feature, latlng) {
				        return L.circleMarker(latlng, geojsonMarkerOptions);
				    },
				    style: style,
				    onEachFeature: onEachFeature
				}).addTo(nearby_layer);

				nearby_layer.addTo(map);

				var collapse_filter = _.filter(nearby_filter, function(x, y){
				return x.properties.Collapse_Potential == "High (>10%)" ||  x.properties.Collapse_Potential == "Very High (100%)" ;
			    });

				var building_count = nearby_filter.length
				var collapse_count = collapse_filter.length

				allbuildings.reset(nearby_filter);
				// var selectedbuildingsView = new SelectedBuildingsView({ collection: allbuildings });

				var tsunami_test = "outside",
					ground_shaking = " high ",
					liquification_potential = " moderate ";

				// $("#buildings-container").empty();
				$('#buildings-list').empty();
				$('#buildings-list').append(selectedbuildingsView.render().el);
				$("#box-info").empty();
				$("#box-info").append(collapse_count)
				$("#buildings-container").show();

		}
		navigator.geolocation.getCurrentPosition(geoSuccess);

		}); 
  

	/**************************************************************************************************************/
	/*** IF USER ENTERS ADDRESS OR ZIP CODE ***/
	/**************************************************************************************************************/
	$("#buildings-search").click(function() {
		var selection = $('#city_selection').val();

		if(selection.length > 0){
			console.log("Greater than zero!")
			// var box = '<div id="box" class="row"><div id="box-info"></div></div></div>'

					$("#nav").css("visibility", "visible");
					$(".container").css("background-image", "none");
					$("#locate-container").toggle().css("margin-top", "0px");
					$("#buildings-container").css("visibility", "visible");
					$("#buildings-container").css("display", "block");
					// $("#building-map").append(box)
					$("#building-map").append('<div id="map"></div>')
					$("#map").empty();
					$("#map").width("100%") //.height("200px") //.css("float", "left")
					 // $( "#container" ).css("background-image", "/")


					 // Using leaflet, generate a map inside the div with the id of "map"
					var map = L.map('map').setView([44.1039, -120.8461], 6);
					map.scrollWheelZoom.disable();

					// Using the Esri plugin for Leaflet, add baselayers and labels to map
					L.esri.basemapLayer("Gray").addTo(map);
					L.esri.basemapLayer("GrayLabels").addTo(map);

					// Add our tsunami layer from a geojson file stored on our server
				    var tsunami_geojson = L.geoJson(tsunami, {
				     style: function () {
				        return { fillColor: "#F2DA00", fillOpacity: 0.75, color: "none", weight: 2, dashArray: '6' };
				      }
				    }).addTo(map).bindPopup('Tsunami zone');
					
					// grab the selection from the user, and check if it's in our list of cities.
					// create a true/false variable for if it's a city
					var selection = $('#city_selection').val();
					var is_city = _.contains(city_list, selection);
					
					// just testing along the way using the console
					console.log("is " + selection + " a city? " + is_city)

					var selectedbuildingsView = new SelectedBuildingsView({ collection: allbuildings });
					
					/**** IF THEY PICK A CITY ****/
					if(is_city == true){
					
						var filtered_data = _.filter(buildings, function(x, y){
												return x.properties.City == "" + selection ;
						    });

						allbuildings.reset(filtered_data);
						// console.log(allbuildings)

						var collapse_filter = _.filter(filtered_data, function(x, y){
							return x.properties.Collapse_Potential == "High (>10%)" ||  x.properties.Collapse_Potential == "Very High (100%)" ;
						    });

						var building_count = allbuildings.length
						var collapse_count = collapse_filter.length

						var tsunami_test = "outside",
							ground_shaking = " high ",
							liquification_potential = " moderate ";

						// $("#buildings-container").empty();
						$('#buildings-list').empty();
						$('#buildings-list').append(selectedbuildingsView.render().el);
						$("#box-info").empty();
						$("#box-info").prepend(collapse_count)
						$("#buildings-container").show();

						$.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + selection + ', OR&key=AIzaSyBSZGyycuPZO0BBfJqO-RBFeKM7_icZUnk', function(data) {
						    //data is the JSON string
							for (i = 0; i < data.results.length; i++) {
							  SearchLat = data.results[i].geometry.location.lat;
							  SearchLng = data.results[i].geometry.location.lng;
							}

							map.removeLayer(nearby_layer)
							nearby_layer.clearLayers()

							map.setView([SearchLat, SearchLng], 11);

							L.geoJson(filtered_data, {
							    pointToLayer: function (feature, latlng) {
							        return L.circleMarker(latlng, geojsonMarkerOptions);
							    },
							    style: style,
							    onEachFeature: onEachFeature

							}).addTo(nearby_layer);

							nearby_layer.addTo(map);


							var gjLayer = L.geoJson(tsunami);
							var results = leafletPip.pointInLayer([SearchLng, SearchLat], gjLayer, {boolean: true});
							console.log(results)

						});

					
					}
					/**** IF THEY DON/T PICK A CITY ****/
					else {			

						// We're assuming if it's not a city, it matches an address, 
						// if it's not an address not nothing happens.

						// Feed the selection into Google's geocoding API
						$.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + selection + '&key=AIzaSyBSZGyycuPZO0BBfJqO-RBFeKM7_icZUnk', function(data) {
						    //data is the JSON string
							
							// get the latitude and longitute of it
							for (i = 0; i < data.results.length; i++) {
							  SearchLat = data.results[i].geometry.location.lat;
							  SearchLng = data.results[i].geometry.location.lng;
							}

							// FAILED EXPERIMENT: var distances = []
							
							//filter probably isn't the best tool here but it works like a champ
							var with_distances = _.filter(buildings, function(x, y){
								
								//create a variables with the latlng of the object 
								var latlng_test = new L.LatLng(x.geometry.coordinates[0], x.geometry.coordinates[1])
								
								//create a variables with the latlng of the user 
								var latlng_test2 = new L.LatLng(SearchLng, SearchLat)
								
								//calculate the distance between the two coordinates using Leaflet.js plugin 
								distance = latlng_test.distanceTo(latlng_test2)
								
								//create an object out of it
								new_distance = {"distance": distance}
								
								//feed that object into our existing json properties
								$.extend(x.properties, new_distance);
								
								//and finally return to us the new json with distance
								return x
						    });

							// Return things within a calculated distance of 5 miles or less
							nearby_filter = _.filter(with_distances, function(x,y){
								return x.properties.distance <= 8046.72
							});


							marker_layer.clearLayers()
							var your_marker = new L.marker([SearchLat,SearchLng]).addTo(marker_layer);
							marker_layer.addTo(map);

							map.removeLayer(nearby_layer)
							nearby_layer.clearLayers()

							map.setView([SearchLat, SearchLng], 11);

							L.geoJson(nearby_filter, {
							    pointToLayer: function (feature, latlng) {
							        return L.circleMarker(latlng, geojsonMarkerOptions);
							    },
							    style: style,
							    onEachFeature: onEachFeature

							}).addTo(nearby_layer);

							nearby_layer.addTo(map);

							var collapse_filter = _.filter(nearby_filter, function(x, y){
							return x.properties.Collapse_Potential == "High (>10%)" ||  x.properties.Collapse_Potential == "Very High (100%)" ;
						    });

							var building_count = nearby_filter.length
							var collapse_count = collapse_filter.length


							allbuildings.reset(nearby_filter);
							// var selectedbuildingsView = new SelectedBuildingsView({ collection: allbuildings });
							var tsunami_test = "outside",
								ground_shaking = " high ",
								liquification_potential = " moderate ";

							// $("#buildings-container").empty();
							$('#buildings-list').empty();
							$('#buildings-list').append(selectedbuildingsView.render().el);
							$("#box-info").empty();
							$("#box-info").append(collapse_count)
							$("#buildings-container").show();

							
							var latlng = L.latLng(-124.41853, 42.41137);
							
							var pip_results = leafletPip.pointInLayer(latlng, tsunami_layer, true);
							console.log(pip_results)

						});

					
					}
		// END IF GREATER THAN ZERO
		}
		else {
			console.log("Zero!")

		}
	});
});