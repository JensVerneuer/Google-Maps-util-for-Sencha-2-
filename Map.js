Ext.define("Utils.Map", {
	statics : {
		echo : function() {
			console.log(arguments);
		},
		addLayer:function(map, url){
			var ctaLayer = new google.maps.KmlLayer(url);
		  	ctaLayer.setMap(map);
		  	return ctaLayer; // Retun an Instance of the Layer
		},
		hideLayer:function(layerInstance){
			layerInstance.setMap(null);			
		},
		addKmlLayer: function(map, url){
			 var ctaLayer = new google.maps.KmlLayer(url);
		  	 ctaLayer.setMap(map);
		  	 return ctaLayer; // Retun an Instance of the Layer
		},
		drawCircles:function(map, center, radius, strokeColor, strokeOpacity, strokeWeight, fillColor, fillOpacity){  // be carefull untested
			var circleOptions = {
		        strokeColor: strokeColor, // Hex Value 
		        strokeOpacity: strokeOpacity, // Value between 0 and 1
		        strokeWeight: strokeWeight,
		        fillColor: fillColor,	// Hex Value 
		        fillOpacity: fillOpacity, // Value between 0 and 1
		        map: map,
		        center: center,
		        radius: radius
		      };
			return(new google.maps.Circle(circleOptions))
		},
		changeMapType:function(){
			//todo
		},
		centerMap : function(gMap, loc, callback, scope) {
			if(loc != null) {
				gMap.setCenter(loc);
				Utils.Map.plotLocation(gMap,loc,"Current Position","Your current position");
			} else {
				navigator.geolocation.getCurrentPosition(function(position) {
					var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					gMap.setCenter(initialLocation);
					Utils.Map.plotLocation(gMap,initialLocation,"Current Position","");
					callback.call(scope,initialLocation);
				}, function() {
					Ext.Msg.alert("Error", "Could not get your position.");
				});
			}
		},
		reversGeoCodeLatLng : function(map, lat, lng, callback ) { // be carefull ..untested
			var lat = parseFloat(lat);
		    var lng = parseFloat(lng);
			geocoder.geocode({'latLng': latlng}, function(results, status) {
			    if (status == google.maps.GeocoderStatus.OK) {
	        		if (results[1]) {
	          			plotLocation(map, latlng, results[1].formatted_address); 
	          			callback(results[0].geometry.location, results[0].formatted_address);
			        } 
			        else {
	        			Ext.Msg.alert("No results found");
	        		}
	      		} else {
	        		Ext.Msg.alert("Geocoder failed due to: " + status);
	     	 	}
			})
		},		
		geoCodeAddress : function(address, callback) {
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				'address' : address
			}, function(results, status) {
				if(status != google.maps.GeocoderStatus.OK) {
					Ext.Msg.alert("Address not found", status);
				} else {
					callback(results[0].geometry.location, results[0].formatted_address);
				}
			});
		},
		plotLocation : function(objMap, pos, title, content) {
			var marker = new google.maps.Marker({
				position : pos,
				map : objMap,
				title : title
			});

			if( typeof content == 'string' && content != '') {
				var infoWindow = new google.maps.InfoWindow({
					content : content
				});
				google.maps.event.addListener(marker, 'click', function() {
					infoWindow.open(objMap, marker);
				})
			} else if( typeof content == 'object') {
				google.maps.event.addListener(marker, 'click', content)
			}
		},
		getDirections : function(origin, destination, travelMode, callback) {

			var travelModes = [google.maps.TravelMode.DRIVING, google.maps.TravelMode.WALKING, google.maps.TravelMode.BICYCLING];

			var directionsService = new google.maps.DirectionsService();
			var request = {
				origin : origin,
				destination : destination,
				travelMode : travelModes[travelMode]
			};
			directionsService.route(request, function(response, status) {
				if(status == google.maps.DirectionsStatus.OK) {
					callback(response);
				}
			});
		},
		streetView : function(pos, domID) {
			var panoramaOptions = {
				position : pos,
				pov : {
					heading : 34,
					pitch : 10,
					zoom : 1
				}
			};
			var panorama = new google.maps.StreetViewPanorama(document.getElementById(domID), panoramaOptions);
		}
	}
});
