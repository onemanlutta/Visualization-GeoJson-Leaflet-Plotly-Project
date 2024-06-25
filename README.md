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



### Step-by-Step Guide

#### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/pabloandresguinda/Project_3_Group_4_Meteorites.git
cd your-repo-name

#### 2\. Set Up MongoDB

*   Install MongoDB and start the MongoDB server.
*   Create a database named `meteorites`.

#### 3\. Data Cleaning and Preprocessing

*   Open the `ETL notebook/meteorite-landings.ipynb` file.
*   Run all cells to clean the dataset and upload it to the MongoDB instance.

#### 4\. Install Node.js Dependencies

bash
Copy code
cd js
npm install

#### 5\. Start the Node.js Server

bash
Copy code
node server.js

This will start the server at `http://localhost:3000`.

#### 6\. View the Application

*   Open `master_index.html` in a web browser to view the interactive map.

### Deployment

*   Deploy the `master_index.html` along with necessary CSS, JS, and data files to GitHub Pages or any static site hosting service.

By following these steps, you will be able to set up and run the visualization locally. If you encounter any issues, please refer to the project documentation and references provided.Word to Markdown Converter



## Ethical Considerations
Throughout this project, we prioritized data privacy and ethical use of information. The meteorite strike data sourced from NASA is publicly available and does not contain any personal or sensitive information about individuals. This aligns with ethical guidelines and regulations such as the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), which emphasize the importance of protecting personal data and ensuring its ethical use. Using data from a reputable source like NASA ensures that the information is accurate and reliable. We ensured that our use of this data was strictly for educational and analytical purposes, avoiding any potential misuse or misrepresentation. Our visualizations and analyses were designed to provide insights into meteorite strikes, a natural phenomenon, without causing harm or bias.

We observed that using an API call to fetch data in real time allows for up-to-date information, enhancing the relevance and accuracy of our visualizations. However, this also necessitates careful handling of data to avoid overloading the server or violating any terms of service set by NASA. Adhering to these guidelines ensures that we respect the data provider's policies and maintain the integrity of our project. By focusing on meteorite strikes, we avoid ethical issues related to personal privacy or sensitive information. Our project demonstrates a commitment to ethical standards in data use, ensuring that the information is used responsibly and respectfully. This approach not only complies with legal requirements but also fosters trust and credibility in our work.


## References

- https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh/data_preview
- https://data.nasa.gov/resource/gh4g-9sfh.json?$limit=50000
- https://medium.com/luwd-media/interstellar-christopher-nolan-s-life-affirming-new-masterpiece-aeb9f341422b
- https://en.wikipedia.org/wiki/Ann_Elizabeth_Fowler_Hodges#:~:text=She%20recalled%20the%20meteorite%20came,giving%20her%20a%20large%20bruise.
- https://www.istockphoto.com/photo/star-shower-gm503020332-81472357
- https://www.astronomy.com/science/unlucky-unconfirmed-tales-of-people-killed-by-meteorites/
- https://www.logo.wine/logo/PostgreSQL
- https://worldvectorlogo.com/logo/mongodb-icon-1
- https://commons.wikimedia.org/wiki/File:Sqlite-square-icon.svg
- https://chatgpt.com/
- https://github.com/
- Xpert Learning Assistant https://bootcampspot.instructure.com/courses/5099/external_tools/313 






