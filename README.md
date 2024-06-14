# The Sky is Falling!

## Project Proposal
**GROUP 4: The Sky is Falling!**

### Idea
Build an interactive map of the different types of meteorites that have fallen from the sky between the years 2016 and 2024 around the world. The user will be able to see what type of meteorite it is (meteorites are often divided into three overall categories based on whether they are dominantly composed of rocky material, metallic material, or mixtures) and the mass in grams in a colorful way, including a drop-down menu to choose the year(s) and category type. The dataset contains over 45,000 rows of data!

### Approach
- Gather bulk data from the NASA database.
- Clean and slim down the dataset and upload it to a Postgres instance using SQL Alchemy.
- Download the data locally and import it into JavaScript as a GeoJSON file.
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

### Tools/Modules to Use
- Python (for data cleaning and processing)
- SQLAlchemy (for database integration)
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
- Database integration using SQL Alchemy
- Uploading the dataset to a Postgres instance

### Pablos Andres Guinda
- Front-end development using JavaScript
- Creating the interactive map using Leaflet/D3/Plotly
- Deploying the map using GitHub Pages

### All
- Documentation and project presentation

An overview of the project and its purpose

Instructions on how to use and interact with the project

Documentation of the database used and why (e.g. benefits of SQL or NoSQL for this project)

ETL workflow with diagrams or ERD

At least one paragraph summarizing efforts for ethical considerations made in the project

References for the data source(s)

References for any code used that is not your own




