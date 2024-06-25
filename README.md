# The Sky is Falling!


**Mission, The Sky is Falling!**

### The Challenge
Build an interactive map of the different types of meteorites that fell from the sky worldwide. The user will be able to see what type of meteorite it is (meteorites are often divided into three overall categories based on whether they are dominantly composed of rocky material, metallic material, or mixtures) and the mass in grams in a colorful way, including a drop-down menu to choose the year(s) and category type. The dataset contains over 45,000 rows of data!

### Approach
- Gather bulk data from the NASA database.
- Preprocess the dataset and transform it to a GeoPandas DataFrame.
- Upload the data frame to a MongoDB instance.
- Instantiate and connect the MongoDB to Node JS.
- Import the database from Node JS into JavaScript as a GeoJSON file.
- Run Leaflet/D3/Plotly in JavaScript to create the interactive map.
- Deploy the map using GitHub Pages.

### Data Set
- [Meteorite Landings](https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh/about_data)
- NASA API: [https://data.nasa.gov/resource/gh4g-9sfh.json](https://data.nasa.gov/resource/gh4g-9sfh.json)

### Group Members
- Nicholas Wiid
- Maero Athanasius Lutta
- Pablos Andres Guinda
- Aye Nyein Mon

## Background

### Motivation
To provide an interactive and educational tool that allows users to explore meteorite data in a visually engaging manner.

### The Process Map

![TheProcessMap](https://github.com/pabloandresguinda/Project_3_Group_4_Meteorites/assets/118937365/7544fd52-a05f-475e-9352-aee48143239d)


### Tools/Modules to Use
- Python (for data cleaning and processing)
- MongoDB (for database integration)
- Node JS (project back-end server)
- JavaScript (for front-end development)
- Leaflet, D3, Plotly (for data visualization)
- GitHub Pages (for deployment)

### Data Sets to Use
- Meteorite Landings dataset from NASA

### Scope
- Purpose: To create an interactive map that displays meteorite landings data from 2016 to 2024.
- Data Type: GeoJSON
- Field and Source of Data: NASA Meteorite Landings dataset

### Questions to Ask of the Data
- What are the types of meteorites that have fallen in different years?
- What is the mass of meteorites that have landed in various locations?
- Are there any patterns in the types and masses of meteorites over the years?

## Tasks Breakdown

### All
- Data gathering from the NASA API

### Aye Nyein Mon and Maero Athanasius Lutta
- Data cleaning and preprocessing
- Database integration and modeling in MongoDB
- Uploading the GeoPandas DataFrame to a MongoDB instance

### Nicholas Wiid and Pablos Andres Guinda
- Front-end development using JavaScript
- Creating the interactive map using Leaflet/D3/Plotly
- Deploying the map using GitHub Pages

### All
- Cross-cutting JavaScript charting and GeoJSON mapping
- Documentation and project presentation

### Project File Structure

|-- CSS/
|   |-- style.css
|-- data/
|   |-- meteorite-landings.csv
|   |-- meteorites_draft.geojson
|-- ETL notebook/
|   |-- meteorite-landings.ipynb
|-- icons/
|   |-- meteor.png
|   |-- meteor2.png
|   |-- skull.png
|-- js/
|   |-- leaflet-heat.js
|   |-- master_logic.js
|   |-- server.js
|-- master_index.html
|-- README.md
|-- The Sky is Falling!!!.ppt
|-- TheDashboard.png
|-- TheProcessMap.png

### Highlight of Key Project Files
- `CSS/style.css` - styles master_index.html
- `data/meteorite-landings.csv` - a backup of the NASA dataset
- `data/meteorites_draft.geojson` - a sample MongoDB dataset with fetches from NASA
- `ETL notebook/meteorite-landings.ipynb` - Jupyter Notebook with the first extraction, transformation and loading code (from NASA to MongoDB instance)
- `js/server.js` - instantiate Node JS server
- `js/leaflet-heat.js` - plot the heat map layer
- `js/master_logic.js` - GeoJSON map layers and Plotly
- `master_index.html` - render the visualization app
- `The Sky is Falling!!!.ppt` - a skim of the project.

### The Dashboard

![TheDashboard](https://github.com/pabloandresguinda/Project_3_Group_4_Meteorites/assets/118937365/7163e922-0671-4542-98ec-e46a4ea2ad98)


References for the data source(s):
https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh/data_preview
https://data.nasa.gov/resource/gh4g-9sfh.json?$limit=50000
https://medium.com/luwd-media/interstellar-christopher-nolan-s-life-affirming-new-masterpiece-aeb9f341422b
https://en.wikipedia.org/wiki/Ann_Elizabeth_Fowler_Hodges#:~:text=She%20recalled%20the%20meteorite%20came,giving%20her%20a%20large%20bruise.
https://www.istockphoto.com/photo/star-shower-gm503020332-81472357
https://www.astronomy.com/science/unlucky-unconfirmed-tales-of-people-killed-by-meteorites/
https://www.logo.wine/logo/PostgreSQL
https://worldvectorlogo.com/logo/mongodb-icon-1
https://commons.wikimedia.org/wiki/File:Sqlite-square-icon.svg
https://chatgpt.com/
https://github.com/
Xpert learning Assistant https://bootcampspot.instructure.com/courses/5099/external_tools/313 






