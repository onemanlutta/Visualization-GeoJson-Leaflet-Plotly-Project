

// Creating the map object
let myMap = L.map("map", {
    center: [0,0],
    zoom: 4
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  

    // Store the API query variables.
    let geoData = "data/meteorites_draft.geojson";


  // POINTS ON THE MAP WITH MARKERS
  // Get the data with d3.
  d3.json(geoData).then(function(data) {
    console.log(data.features)
    let features = data.features
    // Create a new marker cluster group.
    let markers = L.markerClusterGroup();
  
    // Loop through the data.
    for (let i = 0; i < features.length; i++) {
  
      // Set the data location property to a variable.
        let location = features[i].geometry;
        console.log(location)
      // Check for the location property.
      if (location) {
  
        // Add a new marker to the cluster group, and bind a popup.
        markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
          .bindPopup(features[i].properties.name));
    
  
    }
  
    // Add our marker cluster layer to the map.
    myMap.addLayer(markers);
  
  }});
