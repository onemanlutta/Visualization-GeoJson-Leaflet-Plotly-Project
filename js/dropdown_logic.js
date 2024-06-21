// Define a new array variable to hold the data
var meteoriteData = []
var newMeteoritesLayer;

// Define function to fetch data from local server

d3.selectAll('#dropdownMenu').on('change', fetchDataAndSetGlobal)

// Function to perform asynchronous operation and return a Promise
function fetchData() {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/api/data').then(response => {
        return response.json();
      }).then(data => {
        resolve(data);
      });
  });
}

function makeLayers(meteoriteData) {
    console.log(meteoriteData)
    let dropdownMenu = d3.select('#dropdownMenu')
    var yearGroup = dropdownMenu.property("value");
    let yearData = []

    function yearSelect(meteoriteData) {
        if (yearGroup === 'default') {
            yearData = meteoriteData
            console.log('default')
        }
        else if (yearGroup === '0-1950') {
            yearData = meteoriteData.filter(data => data.year_bin == '1950 & Prior')
            console.log('0')
        }
        else if (yearGroup === '1950-1959') {
            yearData = meteoriteData.filter(data => data.year_bin == '1950-1959')
            console.log('1')
        }
        else if (yearGroup === '1960-1969') {
            yearData = meteoriteData.filter(data => data.year_bin == '1960-1969')
            console.log('2')
        }
        else if (yearGroup === '1970-1979') {
            yearData = meteoriteData.filter(data => data.year_bin == '1970-1979')
            console.log('3')
        }
        else if (yearGroup === '1980-1989') {
            yearData = meteoriteData.filter(data => data.year_bin == '1980-1989')
            console.log('4')
        }
        else if (yearGroup === '1990-1999') {
            yearData = meteoriteData.filter(data => data.year_bin == '1990-1999')
            console.log('5')
        }
        else if (yearGroup === '2000-2009') {
            yearData = meteoriteData.filter(data => data.year_bin == '2000-2009')
            console.log('6')
        }
        else if (yearGroup === '2010-2019') {
            yearData = meteoriteData.filter(data => data.year_bin == '2010-2019')
            console.log('7')
        }
        else if (yearGroup === '2020 to date') {
            yearData = meteoriteData.filter(data => data.year_bin == '2020 to date')
            console.log('8')
        }
        else if (yearGroup === '65 million-') {
            yearData = meteoriteData.filter(data => data.year_bin == '65 million years ago')
            console.log('9')
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
                fall: meteorite.fall,
                year: meteorite.year,
                reclat: meteorite.reclat,
                reclong: meteorite.reclong,
                class_name: meteorite.class_name,
                group_name: meteorite.group_name,
                year_bin: meteorite.year_bin,
                log_mass: meteorite.log_mass,
                meteorite_width_cm: meteorite.meteorite_width_cm
            },
            geometry: meteorite.geometry
        }))
    };
    console.log(geojsonData)
    // Run the create features function with converted data
  
    createFeatures(geojsonData)
}


// Function to initiate fetching data and set global variable after a timeout
function fetchDataAndSetGlobal() {
  fetchData().then(data => {
    // Store data in global variable after 3 seconds
    setTimeout(() => {
      meteoriteData = data;
      console.log("Global variable 'meteoriteData' has been set:", meteoriteData);
      
      makeLayers(meteoriteData)
    }, 3000); // Set globalData after 3 seconds
  
}).catch(error => {
    console.error('Error fetching data:', error);

  });
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
    // Remove the existing meteoritesLayer if it exists
  if (newMeteoritesLayer) {
    myMap.removeLayer(newMeteoritesLayer);
    layerControl.removeLayer(newMeteoritesLayer);
  }
   
   
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Meteorite Name: ${feature.properties.name}</h3> <h3>Meteritie Rock-type: ${feature.properties.group_name}</h3> <h3>Meteorite Class: ${feature.properties.class_name}</h3>`)
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
layerControl.addOverlay(newMeteoritesLayer, "Meteors")

}


// Add the tile layer smooth
var smooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}', {
minZoom: 0,
maxZoom: 20,
attribution: '© <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> © <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
ext: 'png'
});

// Define basemaps
let baseMaps = {
Basic: smooth
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
fetchDataAndSetGlobal()


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