require('express-group-routes');
const express = require('express');
const app = express();
const { StorageService } = require('./StorageService');
const { configurations } = require('./Configurations');
const { EpisodesRepository } = require('./repositories/EpisodesRepository');
const { AbstractRepository } = require('./Repositories');
const { SeasonsRepository } = require('./repositories/SeasonsRepository');
const { SeriesRepository } = require('./repositories/SeriesRepository');
const { MoviesRepository } = require('./repositories/MoviesRepository');
const { TvShowsRepository } = require('./repositories/TvShowsRepository');
const { default: axios } = require('axios');

app.use(express.json())

require('./routes/series')(app)
require('./routes/episodes')(app)
require('./routes/movies')(app)
require('./routes/seasons')(app)
require('./routes/tvshows')(app)


const port = configurations.serverPort;
const DEFAULT_DB_FILEPATH = 'repository.json';
let storageService = new StorageService(DEFAULT_DB_FILEPATH);

/** @type {AbstractRepository} */
let catalog = null;
/** @type {EpisodesRepository} */
let episodes = null;
/** @type {SeasonsRepository} */
let seasons = null;
/** @type {SeriesRepository} */
let series = null;
/** @type {MoviesRepository} */
let movies = null;
/** @type {TvShowsRepository} */
let tvShows = null;

let action = process.argv[2] ?? null;
let serverInstance = null;

function post(uri, data) {
    axios.post("http://localhost:3002" + uri, data,
        {
            headers: {
                'Content-type': 'application/json'
            },
        }
    )
}

function put(uri, data) {
    axios.put("http://localhost:3002" + uri, data,
        {
            headers: {
                'Content-type': 'application/json'
            },
        }
    )
}

function startServer(onDone = () => { }) {

    serverInstance = app.listen(port, () => {
        catalog = new AbstractRepository();
        episodes = new EpisodesRepository();
        series = new SeriesRepository();
        movies = new MoviesRepository()
        tvShows = new TvShowsRepository()

        seasons = new SeasonsRepository()
        episodes = new EpisodesRepository()

        // post("/series", [
        //     { "title": "Fake title #1" },
        //     { "title": "Fake title #2" },
        //     { "title": "Fake title #3" }
        // ])
        // post("/episodes", [
        //     { "title": "Episode Fake title #1" },
        //     { "title": "Episode Fake title #2" },
        //     { "title": "Episode Fake title #3" }
        // ])
        // put("/series", [
        //     { "id": 1, "title": "updated title" },
        //     { "id": 100, "title": "updated title for ne item" }
        // ])

        onDone()
    });

}

function stopServer(onDone) {
    serverInstance.close(onDone);
}

switch (action) {
    case 'start':
        startServer();
        break;
    case 'stop':
        stopServer();
        break;
}

module.exports = { startServer, app, stopServer }