const {parse} = require('csv-parse');
const fs = require('fs');

const planets = require('./planets.mongo');

const isHabitablePlanet = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {

    return new Promise((resolve, reject) => {
        fs.createReadStream('src/data/kepler_data.csv')
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    //habitablePlanets.push(data)
                    // insert + update = upsert
                   await savePlanet(data);
                }
            })
            .on('error', (err => {
                console.log(err);
                reject();
            }))
            .on('end', async () => {
                const countPlanetsFound = (await getAllPlanets()).length;
                console.log(`found ${countPlanetsFound} planets`);
                resolve();
            })
    })
}

async function getAllPlanets() {
    // return habitablePlanets;
    return planets.find({});
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        });
    } catch (e) {
        console.error(`Could not save planet ${e}`);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
}
