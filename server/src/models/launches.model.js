const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const axios = require('axios');

const DEFAULT_FLIGHT_NR = 100;

//let latestFliegtNumber = 100;
// launches.set(latestFliegtNumber, launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLauches() {

    console.log('Download Launch data');

    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    })

    if (response.status !== 200) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }

    const launchDocs = response.data.docs;

    for (const launchDoc of launchDocs) {

        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        });

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers
        };

        console.log(`${launch.flightNumber} :: ${launch.mission}`);
        await saveLaunch(launch);
    }

}

async function getAllLaunches(skip, limit) {
    //return Array.from(launches_old.values());
    return launches
        .find({}, {__v: 0, _id: 0})
        .sort({flightNumber: 1})
        .skip(skip)
        .limit(limit);
}

async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });

    if (firstLaunch) {
        console.log('Launch-Data already loaded !"');
    } else {
        await populateLauches();
    }
}

async function findLaunch(filter) {
    return launches.findOne(filter);
}

async function existsLaunchWithId(launchId) {
    return findLaunch({
            flightNumber: launchId
        }
    );
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches
        .findOne()
        .sort('-flightNumber')

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NR;
    }

    return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {

    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

async function scheduleNewLaunch(launch) {

    const planet = await planets.findOne({
        keplerName: launch.target
    });

    if (!planet) {
        throw new Error('No matching planet was found!');
    }
    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        customer: ['ZTM', 'NASA'],
        upcoming: true,
        success: true
    })

    await saveLaunch(newLaunch);
}


async function abortLaunchWithId(launchId) {

    const aborted = await launches.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    })

    return aborted.ok === 1 && aborted.nModified === 1;
}

module.exports = {
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchWithId
}
