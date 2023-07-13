const { Database } = require("./Database");
const { Series, TvShow, Season, Episode, Movie, MultiSeasonMedia, Media } = require("./Media");
const { CLASS_TYPES, TYPE_ROUTE, TYPES_CLASS, routeGroupToMediaType, mediaTypeToRouteGroup } = require("./utils/maps");
const { Worker } = require('worker_threads')
// const { processDatabase } = require("./Server");

let processDatabase = null;
let additionalRoutesGroupsHandlers = {};

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
function batchAppend(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'batchAppend' })
}
function batchDetach(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'batchDetach' })
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
function deleteAll(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'deleteAll' })
}
function appendEpisodes(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'appendEpisodes' })
}
function detachEpisodes(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'detachEpisodes' })
}
function updateEpisodes(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'updateEpisodes' })
}
function appendSeasons(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'appendSeasons' })
}
function detachSeasons(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'detachSeasons' })
}
function updateSeasons(mediaTypeClass) {
    return dbSendRequest({ mediaTypeClass, action: 'updateSeasons' })
}


// function appendSeasons() {
//     return (req, res) => {
//         let seasons = req.body;
//         let db = Database.Get()
//         db.getLock().then(release => {
//             /** @type {MultiSeasonMedia} */
//             let masterItem = db.find(req.params.id)
//             masterItem.appendSeasons(seasons);
//             release();
//             res.send(masterItem.toJson())
//         });
//     };
// }
// function detachSeasons() {
//     return (req, res) => {
//         let seasons = req.body;
//         let db = Database.Get()
//         db.getLock().then(release => {
//             /** @type {MultiSeasonMedia} */
//             let series = db.find(req.params.id)
//             series.detachSeasons(seasons);
//             release();
//             res.send(series.toJson())
//         });
//     };
// }
// function updateSeasons() {
//     return (req, res) => {
//         let seasons = req.body;
//         let db = Database.Get()
//         db.getLock().then(release => {
//             /** @type {MultiSeasonMedia} */
//             let series = db.find(req.params.id)
//             series.updateSeasons(seasons);
//             release();
//             res.send(series.toJson())
//         });
//     };
// }


// function detachEpisodes() {
//     return (req, res) => {
//         let episodes = req.body;
//         let db = Database.Get()
//         db.getLock().then(release => {
//             /** @type {MultiEpisodeMedia} */
//             let masterItem = db.find(req.params.id)
//             masterItem.detachEpisodes(episodes);
//             release();
//             res.send(masterItem.toJson())
//         });
//     };
// }

// function updateEpisodes() {
//     return (req, res) => {
//         let episodes = req.body;
//         let db = Database.Get()
//         db.getLock().then(release => {
//             /** @type {MultiEpisodeMedia} */
//             let masterItem = db.find(req.params.id)
//             masterItem.updateEpisodes(episodes);
//             release();
//             res.send(masterItem.toJson())
//         });
//     };
// }

let routeGroupNames = Object.values(TYPE_ROUTE)
let routeGroupHandlers = {};
routeGroupNames.forEach(routeGroupName => {
    let mediaType = routeGroupToMediaType(routeGroupName)
    let mediaTypeClass = TYPES_CLASS[mediaType]
    routeGroupHandlers[routeGroupName] = {
        ...emptyHandler,
        'delete': remove(mediaTypeClass),
        'getAll': getAll(mediaTypeClass),
        'deleteAll': deleteAll(mediaTypeClass),
        'get': get(mediaTypeClass),
        'post': post(mediaTypeClass),
        'put': update(mediaTypeClass),
        'batchPost': batchPost(mediaTypeClass),
        'batchUpdate': batchUpdate(mediaTypeClass),
        'batchDelete': batchDelete(mediaTypeClass),
    }
})

function prepareAdditionalRoutes() {
    let arr = [];
    arr = [Media.TYPE_SERIES, Media.TYPE_TVSHOW].map(mediaType => mediaTypeToRouteGroup(mediaType))
    arr.forEach(mediaType => {
        additionalRoutesGroupsHandlers[mediaType] = [
            (router) => {
                let mediaTypeClass = TYPES_CLASS[mediaType]
                router.post("/:id/seasons", appendSeasons(mediaTypeClass, Season))
                router.delete("/:id/seasons", detachSeasons(mediaTypeClass, Season))
                router.patch("/:id/seasons", updateSeasons(mediaTypeClass, Season))
            }
        ]
    })

    arr = [Media.TYPE_SEASON, Media.TYPE_MOVIE].map(mediaType => mediaTypeToRouteGroup(mediaType));
    arr.forEach(mediaType => {
        additionalRoutesGroupsHandlers[mediaType] = [
            (router) => {
                let mediaTypeClass = TYPES_CLASS[mediaType]
                router.post("/:id/episodes", appendEpisodes(mediaTypeClass, Episode))
                router.delete("/:id/episodes", detachEpisodes(mediaTypeClass, Episode))
                router.patch("/:id/episodes", updateEpisodes(mediaTypeClass, Episode))
            }
        ]
    })
}

function build_routes_handlers(app, _processDatabase) {
    processDatabase = _processDatabase
    prepareAdditionalRoutes()
    routeGroupNames.forEach(routeGroupName => {
        let routeGroupHandler = routeGroupHandlers[routeGroupName] ?? emptyHandler
        app.group("/" + routeGroupName, (router) => {
            router.post("/batch", routeGroupHandler['batchPost'])
            router.put("/batch", routeGroupHandler['batchUpdate'])
            router.delete("/batch", routeGroupHandler['batchDelete'])
            router.get("/:id", routeGroupHandler['get'])
            router.put("/:id", routeGroupHandler['put'])
            router.delete("/:id", routeGroupHandler['delete'])
            router.post("/", routeGroupHandler['post'])
            router.get("/", routeGroupHandler['getAll'])
            router.delete("/:id", routeGroupHandler['deleteAll'])
            if (routeGroupName in additionalRoutesGroupsHandlers) {
                additionalRoutesGroupsHandlers[routeGroupName].forEach(routeGenerator => {
                    routeGenerator(router)
                })
            }
        })
    })
}



module.exports = { build_routes_handlers }