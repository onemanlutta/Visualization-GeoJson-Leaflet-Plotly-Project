  // Store the API query variables.
  let geoData = "meteorites_draft.geojson";

  // Get the data with d3.
  d3.json(geoData).then(function(data) {
    console.log(data.features)
    createFeatures(data.features)
  })

  function colorpicker(meteorite_type) {
    if (meteorite_type == 'Stony Meteorites') return "#404040";
    else if (meteorite_type == 'Stony-iron meteorites') return '#f4a582';
    else if (meteorite_type == 'Iron meteorites') return '#ca0020';
    else return "#bababa";
    
}


function createFeatures(meteorite_data) {

  // Add circleMarkers layer
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Meteorite Name: ${feature.properties.name}</h3>
        <h3>Meteritie Rock-type: ${feature.properties.group_name}</h3>
        <h3>Meteorite Class: ${feature.properties.class_name}</h3><hr>
        <p><b>Year:</b> ${feature.properties.year}
        <p><b>Mass:</b> ${feature.properties.mass}
        <p><b>Location (Lat/Lon):</b> ${feature.properties.GeoLocation
        } kms`)
    }

    let meteorites = L.geoJson(meteorite_data, {
        
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mass /1000000,
                fillColor: colorpicker(feature.properties.group_name),
                color: colorpicker(feature.properties.group_name),
                weight: 1,
                opacity: 1,
                fillOpacity: 0.75
            });
        }

        })

      // Add Markers layer
        let features = meteorite_data
        // Create a new marker cluster group.
        let markers = L.markerClusterGroup();
      
        // Meteorite icon licence
        // License: Creative Commons 4.0 BY-NC
        var meteoriteIcon = L.icon({
          iconUrl: 'Meteorite.png',
          iconSize:     [50, 50], // size of the icon
          iconAnchor:   [43, 43], // point of the icon which will correspond to marker's location
          popupAnchor:  [-10, -10] // point from which the popup should open relative to the iconAnchor
      });

        // Loop through the data.
        for (let i = 0; i < features.length; i++) {
      
          // Set the data location property to a variable.
            let location = features[i].geometry;
          // Check for the location property.
          if (location) {
      
            // Add a new marker to the cluster group, and bind a popup.
            markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]], {icon: meteoriteIcon})
              .bindPopup(features[i].properties.name));
        
        }
      };

      // Add Heatmap layer
        let heatArray = [];

        for (let i = 0; i < features.length; i++) {
          let location = features[i].geometry;
          if (location) {
            //console.log(location);
            heatArray.push([location.coordinates[1], location.coordinates[0]]);
          }

        }

        let heat = L.heatLayer(heatArray, {
          radius: 30,
          blur: 15})

        createMap(meteorites, markers, heat)

}
  


  function createMap(meteorites, markers, heat) {
    // Add the tile layer street
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    // Add the topographical layer
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });

      let baseMaps = {
        Street: street,
        Topographical: topo
      };

      let overlayMaps = {
        "Meteorite locations": meteorites,
        "Meteorite regional groups": markers, 
        "Meteorite Heatmap": heat
      };

      // Create the map object
      let myMap = L.map("map", {
        center: [0,0],
        zoom: 2.5, 
        minZoom: 3,
        // maxZoom: 3,
        layers: [street, meteorites]
      });

      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

    // Add the Title box
    var titleBox = L.control({position: "bottomleft"});
    titleBox.onAdd = function() {
    var div = L.DomUtil.create('div', 'title_box');
    var legendInfo = "<h3>The Sky is Falling!</h3><hr><h3>Map of Meteorite landings on Earth </h3>"

    div.innerHTML = legendInfo;
 
    return div;

    };
    titleBox.addTo(myMap)

};
