// Define function to fetch data from local server
function fetchData() {
    d3.json('http://localhost:3000/api/data').then(data=> {;
        
        const meteoriteData = data
        console.log('Fetched Meteorite Data:', meteoriteData);
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
        console.log('GeoJSON Data:', geojsonData);
        // createFeatures(geojsonData);
        buildCharts(meteoriteData);
    })
}

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
        // width: 200,
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

// Function to run on page load
function init() {
    fetchData();
}

// Initialize the dashboard
init();