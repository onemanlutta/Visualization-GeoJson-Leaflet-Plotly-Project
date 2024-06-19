// Define a new array variable to hold the data
  let meteoriteData = []

  // Define function to fetch data from local server
  async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/api/data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Save the data to the variable created earlier
        meteoriteData = await response.json();
        // Convert data to geoJSON
        const geojsonData = {
          type: "FeatureCollection",
          features: meteoriteData.map(meteorite => ({
            type: "Feature",
            properties: {
              name: meteorite.name,
              nametype: meteorite.nametype,
              recclass: meteorite.recclass,
              mass: meteorite.mass,
              fall: meteorite.fall,
              year: meteorite.year,
              reclat: meteorite.reclat,
              reclong: meteorite.reclong,
              class_name: meteorite.class_name,
              group_name: meteorite.group_name,
              year_bin: meteorite.year_bin,
              log_mass: meteorite.log_mass,
            },
            geometry: meteorite.geometry
          }))
        };
        console.log(geojsonData)
        // RUn the create features function with converted data
        createFeatures(geojsonData)

        } catch (err) {
        console.error('Error fetching data:', err);
    } 
}



// Define function to choose circle marker colors
  function colorpicker(meteorite_type) {
    if (meteorite_type == 'Stony Meteorite') return "#404040";
    else if (meteorite_type == 'Stony-iron meteorite') return '#f4a582';
    else if (meteorite_type == 'Iron meteorite') return '#ca0020';
    else return "#bababa";
    
}

// Define function to create the map features
function createFeatures(meteorite_data) {

  // Add popup layer
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Meteorite Name: ${feature.properties.name}</h3>
        <h3>Meteritie Rock-type: ${feature.properties.group_name}</h3>
        <h3>Meteorite Class: ${feature.properties.class_name}</h3><hr>
        <p><b>Year:</b> ${feature.properties.year}
        <p><b>Mass:</b> ${Math.round((feature.properties.mass/1000 + Number.EPSILON)*100)/100} kgs 
        <p><b>Location (Lat/Lon):</b> Lat: ${feature.properties.reclat} - Lon: ${feature.properties.reclong}`)
    }
    // Add circle marker layer
    let meteorites = L.geoJson(meteorite_data, {
        
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.log_mass,
                fillColor: colorpicker(feature.properties.group_name),
                color: colorpicker(feature.properties.group_name),
                weight: 1,
                opacity: 1,
                fillOpacity: 0.75
            });
        }

        })

      // Save data features to variable
        let features = meteorite_data.features
        // Create a new marker cluster group.
        let markers = L.markerClusterGroup();
      
        // Meteorite icon licence
        // License: Creative Commons 4.0 BY-NC
        var meteoriteIcon = L.icon({
          iconUrl: 'Meteorite.png',
          iconSize:     [10000, 10000], // size of the icon
          iconAnchor:   [43, 43], // point of the icon which will correspond to marker's location
          popupAnchor:  [-10, -10] // point from which the popup should open relative to the iconAnchor
      });

        // Loop through the data
        for (let i = 0; i < features.length; i++) {
      
          // Set the data location property to a variable
            let location = features[i].geometry;
          // Check for the location property.
          if (location) {
      
            // Add a new marker to the cluster group, and bind a popup.
            markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]], {icon: meteoriteIcon}) // Removed from inside parentheses- , {icon: meteoriteIcon}
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
        // Create the map using feature variables created
        createMap(meteorites, markers, heat)

}
  

  // Define the function to crete the map
  function createMap(meteorites, markers, heat) {
    // Add the tile layer smooth
    var smooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}', {
      minZoom: 0,
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: 'png'
    });
    
    // Add the topographical layer
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });
    
    // Add the satellite layer
    var satellite = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
      minZoom: 0,
      maxZoom: 20,
      attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: 'jpg'
    });

    // Define basemaps
      let baseMaps = {
        Basic: smooth,
        Topographical: topo,
        Satellite: satellite
      };
    // Define overlay maps
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
        layers: [smooth, meteorites]
      });
      // Add control layers
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
// Fetch data from local sever an run maps
fetchData()


