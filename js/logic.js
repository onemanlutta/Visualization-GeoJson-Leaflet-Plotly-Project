  // Store the API query variables.
  let geoData = "data/meteorites_draft.geojson";

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
        createMap(meteorites)

}
  


  function createMap(meteorites) {
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
        Meteorites: meteorites
      };

      // Create the map object
      let myMap = L.map("map", {
        center: [0,0],
        zoom: 2.5, 
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


