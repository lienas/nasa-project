const http = require('http');;
const {mongoConnect} = require('./services/mongo')


const app = require('./app');
const {loadPlanetsData} = require("./models/planets.model");
const {loadLaunchData} = require("./models/launches.model");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);


async function startServer() {
    // options are unnecessary from v6 above
    console.log('mongoConnect');
    await mongoConnect();
    console.log('loadPlanetsData');
    await loadPlanetsData();
    await loadLaunchData();

    server.listen(PORT, () => {
        console.log(`Listen in Port ${PORT}`);
    });
}

startServer();




