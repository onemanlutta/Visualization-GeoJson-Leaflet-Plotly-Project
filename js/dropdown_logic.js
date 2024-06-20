// Define a new array variable to hold the data
let meteoriteData = []
var myMap;


// Convert data to geoJSON
function toGeoJson(data) {
const geojsonData = {
  type: "FeatureCollection",
  features: data.map(meteorite => ({
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
return geojsonData
}

d3.selectAll('#dropdownMenu').on('change', fetchData)
  let dropdownMenu = d3.select('#dropdownMenu')
  var yearGroup = dropdownMenu.property("value")
  console.log(yearGroup)
  


// Define function to fetch data from local server
function fetchData() {
  d3.json('http://localhost:3000/api/data').then(data=>{
    let meteoriteData = data;
    console.log(meteoriteData)

    function yearSelect(meteoriteData) {
      if (yearGroup === 'default') {
          
          let yearData = meteoriteData
          let geojsonData = toGeoJson(yearData)
          updateFeatures(geojsonData)
          return geojsonData
        }
        else if (yearGroup === '0-1950') {
          let newData = fetchData()
          
          let yearData = newData.filter(data => data.year_bin == '1950 & Prior')
          let geojsonData = toGeoJson(yearData)
          return geojsonData
        }
        else if (yearGroup === '1950-1959') {
          console.log('1')
        } 
        else if (yearGroup === '1960-1969') {
          console.log('2')
        }
        else if (yearGroup === '1970-1979') {
          console.log('3')
        }
        else if (yearGroup === '1980-1989') {
          console.log('4')
        }
        else if (yearGroup === '1990-1999') {
          console.log('5')
        }
        else if (yearGroup === '2000-2009') {
          console.log('6')
        }
        else if (yearGroup === '2010-2019') {
          console.log('7')
        }
        else if (yearGroup === '2020 to date') {
          console.log('8')
        }
        else if (yearGroup === '65 million-') {
          console.log('9')
        } 
        else {
          console.log('10')
        }
        // Run the create features function with converted data
        
      }
    let geoData = yearSelect()
        return meteoriteData;
  })
}






  


// Define function to choose circle marker colors
function colorpicker(meteorite_type) {
  if (meteorite_type == 'Stony Meteorite') return "#404040";
  else if (meteorite_type == 'Stony-iron meteorite') return '#f4a582';
  else if (meteorite_type == 'Iron meteorite') return '#ca0020';
  else return "#bababa";

}

// Define function to create the map features
function updateFeatures(meteorite_data) {
  // if (meteoritesLayer) {
  //   myMap.removeLayer(meteoritesLayer);
  // }
  // if (markersLayer) {
  //   myMap.removeLayer(markersLayer);
  // }
  // if (heatLayer) {
  //   myMap.removeLayer(heatLayer);
  // }

  // Add popup layer
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Meteorite Name: ${feature.properties.name}</h3>
        <h3>Meteritie Rock-type: ${feature.properties.group_name}</h3>
        <h3>Meteorite Class: ${feature.properties.class_name}</h3><hr>
        <p><b>Year:</b> ${feature.properties.year}
        <p><b>Mass:</b> ${Math.round((feature.properties.mass / 1000 + Number.EPSILON) * 100) / 100} kgs 
        <p><b>Location (Lat/Lon):</b> Lat: ${feature.properties.reclat} - Lon: ${feature.properties.reclong}`)
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

  // Meteorite icon url: https://pngimg.com/image/63944
  // License: Creative Commons 4.0 BY-NC
  var meteoriteIcon = L.icon({
    iconUrl: 'met.png',
    iconSize: [50, 50], // size of the icon
    iconAnchor: [43, 43], // point of the icon which will correspond to marker's location
    popupAnchor: [-10, -10] // point from which the popup should open relative to the iconAnchor
  });

  // Loop through the data
  for (let i = 0; i < features.length; i++) {
    // Set the data location property to a variable
    let location = features[i].geometry;
    // Check for the location property.
    if (location) {
      // Add a new marker to the cluster group, and bind a popup.
      markersLayer.addLayer(L.marker([location.coordinates[1], location.coordinates[0]], { icon: meteoriteIcon }) // Removed from inside parentheses- , {icon: meteoriteIcon}
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
   // Add layers to the map
   createMap(meteoritesLayer, markersLayer, heatLayer)
}


// Define the function to crete the map
function createMap(meteoritesLayer, markersLayer, heatLayer) {
  if (myMap) {
    myMap.remove();
  }
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
    "Meteorite locations": meteoritesLayer,
    "Meteorite regional groups": markersLayer,
    "Meteorite Heatmap": heatLayer
  };

  // Create the map object
  let myMap = L.map("map", {
    center: [0, 0],
    zoom: 2.5,
    minZoom: 3,
    // maxZoom: 3,
    layers: [smooth, meteoritesLayer]
  });

  // Add control layers
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Add the Title box
  var titleBox = L.control({ position: "bottomleft" });
  titleBox.onAdd = function () {
    var div = L.DomUtil.create('div', 'title_box');
    var legendInfo = "<h3>The Sky is Falling!</h3><hr><h3>Map of Meteorite landings on Earth </h3>"

    div.innerHTML = legendInfo;

    return div;
  };
  titleBox.addTo(myMap)

};

// Fetch data from local sever an run maps
fetchData()


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