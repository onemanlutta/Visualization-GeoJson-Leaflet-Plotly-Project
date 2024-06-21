// Define a new array variable to hold the data
let meteoriteData = []

// Define function to fetch data from local server
async function fetchData() {
  d3.json('http://localhost:3000/api/data').then(data => {
    ;
    // Save the data to the variable created earlier
    meteoriteData = data;
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
          deaths: meteorite.deaths,
          casualties: meteorite.casualties
        },
        geometry: meteorite.geometry
      }))
    };
    console.log(geojsonData)
    // RUn the create features function with converted data
    createFeatures(geojsonData)
    buildCharts(meteoriteData);
  })
}

console.log(meteoriteData)

// Build the buildCharts panel
function buildCharts(data) {
  console.log('Data passed to buildCharts:', data);

  // Extract year_bin from the data
  const yearBins = data.map(d => d.year_bin);
  console.log('Year Bins:', yearBins);

  // Count occurrences of each year_bin
  const yearBinCounts = {};
  yearBins.forEach(bin => {
      if (yearBinCounts[bin]) {
          yearBinCounts[bin]++;
      } else {
          yearBinCounts[bin] = 1;
      }
  });
  console.log('Year Bin Counts:', yearBinCounts);

  // Prepare data for Plotly
  const barData = [{
      x: Object.keys(yearBinCounts),
      y: Object.values(yearBinCounts),
      type: 'bar',
      // orientation: 'h'

  }];

  const layout = {
      title: 'Meteorite Strikes by Year Group',
      xaxis: { title: 'Number of Strikes' },
      yaxis: { title: 'Year Bin' },
      autosize: true,
      height: 250,
      width: 300,
      margin: {
            l: 35, // left margin
            r: 20, // right margin
            t: 50, // top margin
            b: 70  // bottom margin
          },
      yaxis: {
              tickangle: 315 },
      xaxis: {
          tickangle: 315 }
  };

  // Render the bar chart
  Plotly.newPlot('chart', barData, layout);
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
        <p><b>Mass:</b> ${Math.round((feature.properties.mass / 1000 + Number.EPSILON) * 100) / 100} kgs 
        <p><b>Location:</b> Lat: ${feature.properties.reclat} - Lon: ${feature.properties.reclong}`)
  }
  // Add circle marker layer
  let meteoritesLayer = L.geoJson(meteorite_data, {

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
  let markersLayer = L.markerClusterGroup();

  // Meteorite icon licence
  // License: Creative Commons 4.0 BY-NC
    var meteoriteIcon = L.icon({
      iconUrl: 'icons/meteor.png',
      iconSize:     [50, 50],
      iconAnchor:   [43, 43], 
      popupAnchor:  [-10, -10]
  });

  // Loop through the data
  for (let i = 0; i < features.length; i++) {
    // Set the data location property to a variable
    let location = features[i].geometry;
    // Check for the location property.
    if (location) {
      // Add a new marker to the cluster group, and bind a popup.
      markersLayer.addLayer(L.marker([location.coordinates[1], location.coordinates[0]], {icon: meteoriteIcon})
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
  let heatLayer = L.heatLayer(heatArray, {
    radius: 30,
    blur: 15
  })

  // Add deaths layer
  let deathsLayer = L.markerClusterGroup()

  //  Wikimedia commons https://commons.wikimedia.org/wiki/File:Skull_%26_Crossbones_BW.png
  var deathsIcon = L.icon({
    iconUrl: 'icons/skull.png',
    iconSize: [40, 50],
    iconAnchor: [43, 43],
    popupAnchor: [-10, -10]
  });

  let deathsData = features.filter(data => data.properties.deaths != 0)
  console.log(deathsData)
  for (let i = 0; i < deathsData.length; i++) {
    // Set the data location property to a variable
    let deathLocations = deathsData[i].geometry
    // Check for the location property.
    if (deathLocations) {
      // Add a new marker to the cluster group, and bind a popup.
      deathsLayer.addLayer(L.marker([deathLocations.coordinates[1], deathLocations.coordinates[0]], { icon: deathsIcon })
        .bindPopup(`Name and year: ${deathsData[i].properties.name}<hr>
          Number of deaths: ${deathsData[i].properties.deaths}`));
    }
  }

  // Create the map using feature variables created
  createMap(meteoritesLayer, markersLayer, heatLayer, deathsLayer)

}


// Define the function to crete the map
function createMap(meteoritesLayer, markersLayer, heatLayer, deathsLayer) {
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
    "Meteorite by (log)mass": meteoritesLayer,
    "Meteorite locations": markersLayer,
    "Meteorite Heatmap": heatLayer,
    "Meteroite deaths": deathsLayer
  };

  // Create the map object
  let myMap = L.map("map", {
    center: [0, 0],
    zoom: 3,
    minZoom: 2,
    // maxZoom: 3,
    layers: [smooth, meteoritesLayer]
  });
  // Add control layers
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

};
// Fetch data from local sever an run maps
fetchData()


