// Define variables to hold the data and initialize layers
var meteoriteData = []
var newMeteoritesLayer;
var deathsLayer;
var fellLayer;
var newMarkersLayer;

// Setup the listener
d3.selectAll('#dropdownMenu').on('change', updateMap)


// Define function to filter data
function filterData(meteoriteData) {
    let dropdownMenu = d3.select('#dropdownMenu')
    var yearGroup = dropdownMenu.property("value");
    let yearData = []

    function yearSelect(meteoriteData) {
        if (yearGroup === 'default') {
            yearData = meteoriteData
        }
        else if (yearGroup === '1949 & Prior') {
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
    updateDynamicLayers(geojsonData)
    buildStaticLayers(geojsonData)
    buildCharts(yearData)
}


// Function to initiate fetching data
function updateMap() {
    d3.json('data/final_meteorite_data.json')
    .then(data => {
      meteoriteData = data
      console.log("Variable 'meteoriteData' has been set:", meteoriteData);

      filterData(meteoriteData)
  })
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
      title: '',
      xaxis: { title: 'Number of Strikes' },
      yaxis: { title: 'Year Bin' },
      autosize: true,
      height: 250,
      width: 300,
      margin: {
            l: 35,
            r: 20,
            t: 50,
            b: 70
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

function addLegend() {
  // Function to add legend to the map
  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'info legend');
      let rocktype_colors = {
        'Stony Meteorite': "#404040",
        'Stony-iron meteorite':'#f4a582',
        'Iron meteorite':'#ca0020',
        'Unknown': "#bababa"
      };
      let labels = []
  
      var legendInfo = "<h6>Meteorite rock type</h6>" +
      "<div class=\"labels\">"
  
      for (let type in rocktype_colors) {
        let color = rocktype_colors[type]
        labels.push('<i style="background:' + color + '"></i> ' + type + '<br>');
      }
  
      legendInfo += "<ul>" + labels.join("") + "</ul>";
      div.innerHTML = legendInfo;
      return div;
  ;
  }
  legend.addTo(myMap)
  }

// Define function to create the map features
function updateDynamicLayers(meteorite_data) {
    // Remove the existing meteoritesLayer if it exists
  if (newMeteoritesLayer) {
    myMap.removeLayer(newMeteoritesLayer);
    layerControl.removeLayer(newMeteoritesLayer);
  }
  
   
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h6>Meteorite Name: ${feature.properties.name}</h6>
        <h6>Meteritie Rock-type: ${feature.properties.group_name}</h6>
        <h6>Meteorite Class: ${feature.properties.class_name}</h6><hr>
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

// Add overlay maps overlay maps
myMap.addLayer(newMeteoritesLayer)
layerControl.addOverlay(newMeteoritesLayer, "Rock type")
}

// Function to built static layers
function buildStaticLayers(meteorite_data) {
if (deathsLayer) {
  myMap.removeLayer(deathsLayer);
  layerControl.removeLayer(deathsLayer);
}
if (fellLayer) {
  myMap.removeLayer(fellLayer);
  layerControl.removeLayer(fellLayer);
}


// Create deaths layer - Meteorite related deaths
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
      .bindPopup(`<h6>Meteorite Name: ${deathsData[i].properties.name}</h6>
        <h6>Meteritie Rock-type: ${deathsData[i].properties.group_name}</h6>
        <h6>Meteorite Class: ${deathsData[i].properties.class_name}</h6><hr>
        <p><b>Year:</b> ${deathsData[i].properties.year}
        <p><b>Mass:</b> ${deathsData[i].properties.mass_string}
        <p><b>Diameter:</b> ${deathsData[i].properties.meteorite_width_cm_string}
        <p><b>Location:</b> Lat: ${deathsData[i].properties.reclat} - Lon: ${deathsData[i].properties.reclong}
        <p><b>Number of deaths:</b> ${deathsData[i].properties.deaths_string}`));
  }
}

// Create fell layers - Meteorite sitings
let fellfeatures = meteorite_data.features
fellLayer = L.markerClusterGroup()

//  https://pngimg.com/image/63932 License: Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
var fellIcon = L.icon({
  iconUrl: 'icons/meteor2.png',
  iconSize: [60, 80],
  iconAnchor: [50, 50],
  popupAnchor: [-10, -10]
});

let fellData = fellfeatures.filter(data => data.properties.fall == 'Fell')
for (let i = 0; i < fellData.length; i++) {
  // Set the data location property to a variable
  let fellLocations = fellData[i].geometry
  // Check for the location property.
  if (fellLocations) {
    // Add a new marker to the cluster group, and bind a popup.
    fellLayer.addLayer(L.marker([fellLocations.coordinates[1], fellLocations.coordinates[0]], { icon: fellIcon })
      .bindPopup(`<h6>Meteorite Name: ${fellData[i].properties.name}</h6>
        <h6>Meteritie Rock-type: ${fellData[i].properties.group_name}</h6>
        <h6>Meteorite Class: ${fellData[i].properties.class_name}</h6><hr>
        <p><b>Year:</b> ${fellData[i].properties.year}
        <p><b>Mass:</b> ${fellData[i].properties.mass_string}
        <p><b>Diameter:</b> ${fellData[i].properties.meteorite_width_cm_string}
        <p><b>Location:</b> Lat: ${fellData[i].properties.reclat} - Lon: ${fellData[i].properties.reclong}`));
  }
}

// Add overlay maps overlay maps
layerControl.addOverlay(deathsLayer, "Deaths")
layerControl.addOverlay(fellLayer, "Seen and found")

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
var dark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});

// Define basemaps
let baseMaps = {
  Basic: smooth,
  Topographical: topo,
  Satellite: dark
};

let overlayMaps = {}

// Create the map object
let myMap = L.map("map", {
center: [0, 0],
zoom: 2,
minZoom: 2,
layers: [smooth]
});

// Add control layers
var layerControl = L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);

// Fetch data from local sever an run maps
updateMap()
addLegend()