const { Database } = require("./Database");
const { Series, TvShow, Season, Episode, Movie, MultiSeasonMedia, Media } = require("./Media");
const { CLASS_TYPES } = require("./utils/maps");
const { Worker } = require('worker_threads')
// const { processDatabase } = require("./Server");

let processDatabase = null;
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


async function db(params) {
    let promise = new Promise((ok) => {
        processDatabase.send(params)
        processDatabase.on("message", ({ replyTo, payload, status }) => {
            if (replyTo === params.action) {
                ok(payload)
            }
        })
    });

    return await promise
}

function dbSendRequest({ mediaTypeClass, action }) {
    return async (req, res) => {
        let jsonResponse = await db({
            mediaType: CLASS_TYPES[mediaTypeClass],
            payload: req.body,
            urlParams: req.params,
            action
        });
        switch (req.method) {
            case 'GET':
                if (jsonResponse === undefined) {
                    res.sendStatus(404);
                }
            default:
                res.json(jsonResponse)
                break;
        }
    }
}

function post(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'post' })
}
function batchPost(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'batchPost' })
}
function batchUpdate(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'batchUpdate' })
}
function batchDelete(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'batchDelete' })
}
function get(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'get' })
}
function update(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'update' })
}
function remove(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'delete' })
}
function getAll(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'getAll' })
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
        'delete': remove(Series),
        'getAll': getAll(Series),
        'get': get(Series),
        'post': post(Series),
        'put': update(Series),
        'appendSeasons': appendSeasons(),
        'detachSeasons': detachSeasons(),
        'updateSeasons': updateSeasons(),
        'batchPost': batchPost(Series),
        'batchUpdate': batchUpdate(Series),
        'batchDelete': batchDelete(Series),

    },
    'episodes': {
        ...emptyHandler,
        'delete': remove(Episode),
        'getAll': getAll(Episode),
        'get': get(Episode),
        'post': post(Episode),
        'put': update(Episode),
        'batchPost': batchPost(Episode),
        'batchUpdate': batchUpdate(Episode),
        'batchDelete': batchDelete(Episode),

    },
    'seasons': {
        ...emptyHandler,
        'delete': remove(Season),
        'getAll': getAll(Season),
        'get': get(Season),
        'post': post(Season),
        'put': update(Season),
        'appendEpisodes': appendEpisodes(),
        'detachEpisodes': detachEpisodes(),
        'updateEpisodes': updateEpisodes(),
        'batchPost': batchPost(Season),
        'batchUpdate': batchUpdate(Season),
        'batchDelete': batchDelete(Season),
    },
    'tv-shows': {
        ...emptyHandler,
        'delete': remove(TvShow),
        'getAll': getAll(TvShow),
        'get': get(TvShow),
        'post': post(TvShow),
        'put': update(TvShow),
        'appendSeasons': appendSeasons(),
        'detachSeasons': detachSeasons(),
        'updateSeasons': updateSeasons(),
        'batchPost': batchPost(TvShow),
        'batchUpdate': batchUpdate(TvShow),
        'batchDelete': batchDelete(TvShow),
    },
    'movies': {
        ...emptyHandler,
        'delete': remove(Movie),
        'getAll': getAll(Movie),
        'get': get(Movie),
        'post': post(Movie),
        'put': update(Movie),
        'appendEpisodes': appendEpisodes(),
        'detachEpisodes': detachEpisodes(),
        'updateEpisodes': updateEpisodes(),
        'batchPost': batchPost(Movie),
        'batchUpdate': batchUpdate(Movie),
        'batchDelete': batchDelete(Movie),
    },
}


let mediaTypes = ["series", "movies", "seasons", "episodes", "tv-shows"]
let additionalRoutes = {
    "series": [
        (router) => {
            let mediaTypeHandler = handlers["series"] ?? emptyHandler
            router.post("/:id/seasons", mediaTypeHandler['appendSeasons'])
            router.delete("/:id/seasons", mediaTypeHandler['detachSeasons'])
            router.patch("/:id/seasons", mediaTypeHandler['updateSeasons'])
        }
    ],
    "tv-shows": [
        (router) => {
            let mediaTypeHandler = handlers["tv-shows"] ?? emptyHandler
            router.post("/:id/seasons", mediaTypeHandler['appendSeasons'])
            router.delete("/:id/seasons", mediaTypeHandler['detachSeasons'])
            router.patch("/:id/seasons", mediaTypeHandler['updateSeasons'])
        }
    ],
    "seasons": [
        (router) => {
            let mediaTypeHandler = handlers["seasons"] ?? emptyHandler
            router.post("/:id/episodes", mediaTypeHandler['appendEpisodes'])
            router.delete("/:id/episodes", mediaTypeHandler['detachEpisodes'])
            router.patch("/:id/episodes", mediaTypeHandler['updateEpisodes'])
        }
    ],
    "movies": [
        (router) => {
            let mediaTypeHandler = handlers["movies"] ?? emptyHandler
            router.post("/:id/episodes", mediaTypeHandler['appendEpisodes'])
            router.delete("/:id/episodes", mediaTypeHandler['detachEpisodes'])
            router.patch("/:id/episodes", mediaTypeHandler['updateEpisodes'])
        }
    ]
}

function build_routes_handlers(app, _processDatabase) {
    processDatabase = _processDatabase
    mediaTypes.forEach(mediaType => {
        let mediaTypeHandler = handlers[mediaType] ?? emptyHandler
        app.group("/" + mediaType, (router) => {
            router.post("/", mediaTypeHandler['post'])
            router.post("/batch", mediaTypeHandler['batchPost'])
            router.get("/", mediaTypeHandler['getAll'])
            router.get("/:id", mediaTypeHandler['get'])
            router.put("/:id", mediaTypeHandler['put'])
            router.put("/batch", mediaTypeHandler['batchPut'])
            router.delete("/:id", mediaTypeHandler['delete'])
            router.delete("/batch", mediaTypeHandler['batchDelete'])
            if (mediaType in additionalRoutes) {
                additionalRoutes[mediaType].forEach(routeGenerator => {
                    routeGenerator(router)
                })
            }
        })
    })
}



module.exports = { build_routes_handlers }