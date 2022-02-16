// const launches = require('./launches.mongo');

const launches = new Map();

let latestFliegtNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
};

launches.set(latestFliegtNumber, launch);

function getAllLaunches() {
    return Array.from(launches.values());
}

function addNewLaunch(launch) {
    latestFliegtNumber++;
    launches.set(
        latestFliegtNumber,
        Object.assign(launch, {
            flightNumber: latestFliegtNumber,
            customer: ['ZTM', 'NASA'],
            upcoming: true,
            success: true
        }))
}

function existsLaunchWithId(launchId) {
    return launches.has(launchId);
}

function abortLaunchWithId(launchId) {
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchWithId
}
