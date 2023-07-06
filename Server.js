require('express-group-routes');
const express = require('express');
const axios = require('axios')
const app = express();
const { EpisodesRepository, MoviesRepository, SeasonsRepository, SeriesRepository, TvShowsRepository, AbstractRepository } = require('./Repositories');
const { StorageService } = require('./StorageService');
const { Season } = require('./MediaItems');

const port = 3002;
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


app.use(express.json())


require('./routes/series')(app)
require('./routes/seasons')(app)
require('./routes/tvshows')(app)
require('./routes/movies')(app)
require('./routes/episodes')(app)


app.listen(port, () => {
    catalog = new AbstractRepository();
    episodes = new EpisodesRepository();
    seasons = new SeasonsRepository();
    series = new SeriesRepository();
    movies = new MoviesRepository()
    tvShows = new TvShowsRepository()

    axios.post("http://localhost:" + port + "/episodes/create", { title: "La fine dell'inizio" })
    axios.post("http://localhost:" + port + "/seasons/create", { title: "01 Breaking Bad" })
    axios.post("http://localhost:" + port + "/series/create", { title: "Breaking bad", productionYear: 2010 })
    axios.post("http://localhost:" + port + "/movies/create", { title: "Il Padrino", productionYear: 2010 })

    axios.post("http://localhost:" + port + "/series/3/seasons", { title: "01 Breaking Bad created by http call" })
    axios.post("http://localhost:" + port + "/series/3/seasons/2")
    axios.delete("http://localhost:" + port + "/series/3/seasons/2")


    // axios.post("http://localhost:" + port + "/tv-shows/create", { title: "The late show", productionYear: 2010 })


    console.log("MediaServer listening on port " + port);
})