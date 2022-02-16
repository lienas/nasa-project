const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');
const {loadPlanetsData} = require("./models/planets.model");

const PORT = process.env.PORT || 8000;
const MONGO_URL =
    'mongodb+srv://nasa-api:eysJa5rVD0NfZ411@nasacluster.kwyqa.mongodb.net/' +
    'nasa-db?retryWrites=true&w=majority'

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('MongoDB Connection Ready')
})

mongoose.connection.on('error', (err) => {
    console.log(err);
})

async function startServer() {
    // options are unnecessary from v6 above
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`Listen in Port ${PORT}`);
    });
}

startServer();




