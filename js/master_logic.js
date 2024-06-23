// Define a new array variable to hold the data
var meteoriteData = []
var newMeteoritesLayer;
var deathsLayer;
var newMarkersLayer;

// Define function to fetch data from local server

d3.selectAll('#dropdownMenu').on('change', updateMap)

// Function to perform asynchronous operation and return a Promise
function getData() {
  return new Promise((resolve, reject) => {
    d3.json('http://localhost:3000/api/data')
      .then(data => resolve(data));
  });
}

function filterData(meteoriteData) {
    let dropdownMenu = d3.select('#dropdownMenu')
    var yearGroup = dropdownMenu.property("value");
    let yearData = []

    function yearSelect(meteoriteData) {
        if (yearGroup === 'default') {
            yearData = meteoriteData
        }
        else if (yearGroup === '0-1949') {
            yearData = meteoriteData.filter(data => data.year_bin == '1949 & Prior')
        }
        else if (yearGroup === '1950-1959') {
            yearData = meteoriteData.filter(data => data.year_bin == '1950-1959')
        }
        else if (yearGroup === '1960-1969') {
            yearData = meteoriteData.filter(data => data.year_bin == '1960-1969')
        }
        else if (yearGroup === '1970-1979') {
            yearData = meteoriteData.filter(data => data.year_bin == '1970-1979')
        }
        else if (yearGroup === '1980-1989') {
            yearData = meteoriteData.filter(data => data.year_bin == '1980-1989')
        }
        else if (yearGroup === '1990-1999') {
            yearData = meteoriteData.filter(data => data.year_bin == '1990-1999')
        }
        else if (yearGroup === '2000-2009') {
            yearData = meteoriteData.filter(data => data.year_bin == '2000-2009')
        }
        else if (yearGroup === '2010-2019') {
            yearData = meteoriteData.filter(data => data.year_bin == '2010-2019')
        }
        else if (yearGroup === '2020 to date') {
            yearData = meteoriteData.filter(data => data.year_bin == '2020 to date')
        }
        else if (yearGroup === '65 million-') {
            yearData = meteoriteData.filter(data => data.year_bin == '65 million years ago')
        }
        return yearData
    }
    yearData = yearSelect(meteoriteData)


    // Convert data to geoJSON
    const geojsonData = {
        type: "FeatureCollection",
        features: yearData.map(meteorite => ({
            type: "Feature",
            properties: {
                name: meteorite.name,
                nametype: meteorite.nametype,
                recclass: meteorite.recclass,
                mass: meteorite.mass,
                mass_string: meteorite.mass_string,
                fall: meteorite.fall,
                year: meteorite.year,
                reclat: meteorite.reclat,
                reclong: meteorite.reclong,
                class_name: meteorite.class_name,
                group_name: meteorite.group_name,
                year_bin: meteorite.year_bin,
                log_mass: meteorite.log_mass,
                meteorite_width_cm: meteorite.meteorite_width_cm,
                meteorite_width_cm_string: meteorite.meteorite_width_cm_string,
                deaths: meteorite.deaths,
                casualties: meteorite.casualties,
                deaths_string: meteorite.deaths_string,

            },
            geometry: meteorite.geometry
        }))
    };
    // Run the create features function with converted data
  
    updateLayers(geojsonData)
    buildCharts(meteoriteData)
}


// Function to initiate fetching data and set global variable after a timeout
function updateMap() {
  getData().then(data => {
      meteoriteData = data;
      console.log("Variable 'meteoriteData' has been set:", meteoriteData);

      filterData(meteoriteData)
  });
}

// Build the buildCharts panel
function buildCharts(data) {
  // Extract year_bin from the data
  const yearBins = [
    '1949 & Prior', '1950-1959', '1960-1969', '1970-1979',
    '1980-1989', '1990-1999', '2000-2009', '2010-2019',
    '2020 & Later', '65 million years ago'
  ];

  // Count occurrences of each year_bin
  const yearBinCounts = {};
  yearBins.forEach(bin => {
    yearBinCounts[bin] = 0;
  });

  // Count occurrences of each year_bin
  data.forEach(d => {
    // Assume d.year_bin contains the appropriate bin name (e.g., '1950-1959')
    if (yearBinCounts[d.year_bin]) {
      yearBinCounts[d.year_bin]++;
    } else {
      yearBinCounts[d.year_bin] = 1;
    }
  });

  // Prepare data for Plotly
  const sortedCounts = yearBins.map(bin => yearBinCounts[bin]);

  const barData = [{
    x: yearBins,
    y: sortedCounts,
    type: 'bar'
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
function updateLayers(meteorite_data) {
    // Remove the existing meteoritesLayer if it exists
  if (newMeteoritesLayer) {
    myMap.removeLayer(newMeteoritesLayer);
    layerControl.removeLayer(newMeteoritesLayer);
  }
  if (deathsLayer) {
    myMap.removeLayer(deathsLayer);
    layerControl.removeLayer(deathsLayer);
  }
  if (newMarkersLayer) {
      myMap.removeLayer(newMarkersLayer);
      layerControl.removeLayer(newMarkersLayer);
  }
   
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Meteorite Name: ${feature.properties.name}</h3>
        <h3>Meteritie Rock-type: ${feature.properties.group_name}</h3>
        <h3>Meteorite Class: ${feature.properties.class_name}</h3><hr>
        <p><b>Year:</b> ${feature.properties.year}
        <p><b>Mass:</b> ${feature.properties.mass_string}
        <p><b>Diameter:</b> ${feature.properties.meteorite_width_cm_string}
        <p><b>Location:</b> Lat: ${feature.properties.reclat} - Lon: ${feature.properties.reclong}`)
}
// Add circle marker layer
newMeteoritesLayer = L.geoJson(meteorite_data, {

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
newMarkersLayer = L.markerClusterGroup();

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
    newMarkersLayer.addLayer(L.marker([location.coordinates[1], location.coordinates[0]], {icon: meteoriteIcon})
      .bindPopup(features[i].properties.name));
  }
};

// Add deaths layer
let deathsfeatures = meteorite_data.features
deathsLayer = L.markerClusterGroup()

//  Wikimedia commons https://commons.wikimedia.org/wiki/File:Skull_%26_Crossbones_BW.png
var deathsIcon = L.icon({
  iconUrl: 'icons/skull.png',
  iconSize: [40, 50],
  iconAnchor: [43, 43],
  popupAnchor: [-10, -10]
});

let deathsData = deathsfeatures.filter(data => data.properties.deaths != 0)
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

// Add overlay maps overlay maps
myMap.addLayer(newMeteoritesLayer)
layerControl.addOverlay(newMeteoritesLayer, "Rock type")
layerControl.addOverlay(newMarkersLayer, "Locations")
layerControl.addOverlay(deathsLayer, "Deaths")
}

// Add the tile layer smooth
var smooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}', {
minZoom: 0,
maxZoom: 20,
attribution: '© <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> © <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

let overlayMaps = {}

// Create the map object
let myMap = L.map("map", {
center: [0, 0],
zoom: 2,
minZoom: 3,
// maxZoom: 3,
layers: [smooth]
});

// Add control layers
var layerControl = L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);

// Fetch data from local sever an run maps
updateMap()


///// Dropdown setup
//  var dropdownContainer = document.getElementById('dropdownContainer');
//  var select = document.createElement('select');
//    select.id = 'dropdownMenu'
 
//  var yearBins = [
//    {value: 'default', text: 'All Years'},
//    {value: '0-1950', text: '1950 & Prior'},
//    {value: '1950-1959', text: '1950-1959'},
//    {value: '1960-1969', text: '1960-1969'},
//    {value: '1970-1979', text: '1970-1979'},
//    {value: '1980-1989', text: '1980-1989'},
//    {value: '1990-1999', text: '1990-1999'},
//    {value: '2000-2009', text: '2000-2009'},
//    {value: '2010-2019', text: '2010-2019'},
//    {value: '2020 to date', text: '2020 to date'},
//    {value: '65 million-', text: '65 million years ago'}
//  ]
 
//  yearBins.forEach(function(yearbin) {
//    var option = document.createElement('option');
//    option.value = yearbin.value;
//    option.text = yearbin.text;
//    select.appendChild(option)
//  })
 
//  dropdownContainer.appendChild(select)