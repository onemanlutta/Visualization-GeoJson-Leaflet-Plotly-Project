// Setup the express server
const express = require('express');
// Setup the mongo connection
const { MongoClient } = require('mongodb');
// Setup cross origin middleware
const cors = require('cors');

// Initialize the server and port
const app = express();
const port = 3000;

// Save the MongoDB deployment connection string
const uri = "mongodb://localhost:27017";

// Initiate Mongo connectio
const client = new MongoClient(uri);

// Initialise the function to get data from the Mongo database
async function getData() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to server");

        // Access the database
        const meteordb = client.db("meteorite_landings");
        // Access the desired collection
        const meteorCollection = meteordb.collection("meteorite_geo");
        const meteorData = await meteorCollection.find({}).toArray();

        return meteorData;
    } finally {
        await client.close();
    }
}

// Enable server to handle requests from different origins with cors
app.use(cors());

// Define API endpoint
app.get('/api/data', async (req, res) => {
    try {
        const data = await getData();
        res.json(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Listen for running server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
