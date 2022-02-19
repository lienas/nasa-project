const {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchWithId
} = require("../../models/launches.model");

const {
    getPagination
} = require("../../services/query")

async function httpGetAllLaunches(req, res) {
    const {skip, limit} = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;

    // validate for missing data
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property'
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    // if(launch.launchDate.toString() === 'Invalid Date') {
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid Date'
        });
    }

    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {

    const launchId = Number(req.params.id);

    const existLaunch = await existsLaunchWithId(launchId);

    if (!existLaunch) {
        return res.status(404).json({
            error: 'launch does not exist'
        })
    }
    const aborted = await abortLaunchWithId(launchId);
    if (!aborted) {
        return res.status(400).json({error: 'Launch not aborted'})
    }
    return res.status(200).json({
        ok: true
    });

}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
};
