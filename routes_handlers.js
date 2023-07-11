const { Database } = require("./Database");
const { Series, TvShow, Season, Episode, Movie, MultiSeasonMedia, Media } = require("./Media");
const { CLASS_TYPES } = require("./utils/maps");
const { Worker } = require('worker_threads')

let emptyHandler = {
    'post': (req, res) => {
        res.status(404).send("Not yet implemented");
    },
    'get': (req, res) => { res.status(404).send("Not yet implemented"); },
    'put': (req, res) => { res.status(404).send("Not yet implemented"); },
    'delete': (req, res) => { res.status(404).send("Not yet implemented"); },
    'batchPost': (req, res) => {
        res.status(404).send("Not yet implemented");
    },
    'batchPut': (req, res) => { res.status(404).send("Not yet implemented"); },
    'batchDelete': (req, res) => { res.status(404).send("Not yet implemented"); },

    'additional': (req, res) => { res.status(404).send("Not yet implemented"); },

}

function post(mediaTypeClass) {
    return (req, res) => {
        let json = req.body;
        let newMedia = mediaTypeClass.fromJson(json);
        let db = Database.Get()
        db.getLock().then(release => {
            release()
            res
                .status(200)
                .send(db.add(newMedia))
        })
    }
}


function batchPost(mediaTypeClass) {
    return (req, res) => {
        let db = Database.Get();
        db.getLock().then(release => {
            let worker = new Worker('./workers/batchPost', {
                workerData: {
                    jsonDatabase: db.serialize(),
                    jsonRequest: req.body,
                    iMediaCounter: Media.ID,
                    sMediaType: CLASS_TYPES[mediaTypeClass]
                }
            });
            worker.on('message', (result) => {
                db.fromJson(result.jsonDatabase)
                Media.setID(result.iMediaCounter)
                res.send(result.mediaItems);
                release()
            });
            worker.postMessage([])
        })
    }
}


function get(mediaTypeClass) {
    return (req, res) => {
        let db = Database.Get()
        db.getLock().then(release => {
            release()
            let found = db.find(req.params.id);
            if (found) {
                res
                    .status(200)
                    .send(found.toJson())
            } else {
                res.sendStatus(404)
            }
        })
    }
}
function put(mediaTypeClass) {
    return (req, res) => {
        let json = req.body;
        json.id = req.params.id
        let db = Database.Get()
        let mediaFromJson = mediaTypeClass.fromJson(json);
        let isUpdated = db.update(mediaFromJson.id, mediaFromJson);
        if (isUpdated === null) {
            res.sendStatus(404);
            return;
        }
        db.getLock().then(release => {
            release()
            res
                .status(200)
                .send(db.find(req.params.id).toJson())
        })
    }
}
function getAll(mediaTypeClass) {
    return (req, res) => {
        let db = Database.Get()
        db.getLock().then(release => {
            res.send(db.findAllOf(mediaTypeClass).map(media => media.toJson()))
            release()
        });
    };
}

function appendSeasons() {
    return (req, res) => {
        let seasons = req.body;
        let db = Database.Get()
        db.getLock().then(release => {
            /** @type {MultiSeasonMedia} */
            let masterItem = db.find(req.params.id)
            masterItem.appendSeasons(seasons);
            release();
            res.send(masterItem.toJson())
        });
    };
}
function detachSeasons() {
    return (req, res) => {
        let seasons = req.body;
        let db = Database.Get()
        db.getLock().then(release => {
            /** @type {MultiSeasonMedia} */
            let series = db.find(req.params.id)
            series.detachSeasons(seasons);
            release();
            res.send(series.toJson())
        });
    };
}
function updateSeasons() {
    return (req, res) => {
        let seasons = req.body;
        let db = Database.Get()
        db.getLock().then(release => {
            /** @type {MultiSeasonMedia} */
            let series = db.find(req.params.id)
            series.updateSeasons(seasons);
            release();
            res.send(series.toJson())
        });
    };
}

function appendEpisodes() {
    return (req, res) => {
        let episodes = req.body;
        let db = Database.Get()
        db.getLock().then(release => {
            /** @type {MultiEpisodeMedia} */
            let masterItem = db.find(req.params.id)
            masterItem.appendEpisodes(episodes);
            release();
            res.send(masterItem.toJson())
        });
    };
}

function detachEpisodes() {
    return (req, res) => {
        let episodes = req.body;
        let db = Database.Get()
        db.getLock().then(release => {
            /** @type {MultiEpisodeMedia} */
            let masterItem = db.find(req.params.id)
            masterItem.detachEpisodes(episodes);
            release();
            res.send(masterItem.toJson())
        });
    };
}

function updateEpisodes() {
    return (req, res) => {
        let episodes = req.body;
        let db = Database.Get()
        db.getLock().then(release => {
            /** @type {MultiEpisodeMedia} */
            let masterItem = db.find(req.params.id)
            masterItem.updateEpisodes(episodes);
            release();
            res.send(masterItem.toJson())
        });
    };
}

let handlers = {
    'series': {
        ...emptyHandler,
        'getAll': getAll(Series),
        'get': get(Series),
        'post': post(Series),
        'put': put(Series),
        'batchPost': batchPost(Series),
        'appendSeasons': appendSeasons(),
        'detachSeasons': detachSeasons(),
        'updateSeasons': updateSeasons(),

    },
    'episodes': {
        ...emptyHandler,
        'getAll': getAll(Episode),
        'get': get(Episode),
        'post': post(Episode),
        'put': put(Episode),
    },
    'seasons': {
        ...emptyHandler,
        'getAll': getAll(Season),
        'get': get(Season),
        'post': post(Season),
        'put': put(Season),
        'appendEpisodes': appendEpisodes(),
        'detachEpisodes': detachEpisodes(),
        'updateEpisodes': updateEpisodes(),
    },
    'tv-shows': {
        ...emptyHandler,
        'getAll': getAll(TvShow),
        'get': get(TvShow),
        'post': post(TvShow),
        'put': put(TvShow),
        'appendSeasons': appendSeasons(),
        'detachSeasons': detachSeasons(),
        'updateSeasons': updateSeasons(),
    },
    'movies': {
        ...emptyHandler,
        'getAll': getAll(Movie),
        'get': get(Movie),
        'post': post(Movie),
        'put': put(Movie),
        'appendEpisodes': appendEpisodes(),
        'detachEpisodes': detachEpisodes(),
        'updateEpisodes': updateEpisodes(),
    },
}

module.exports = { handlers, emptyHandler }