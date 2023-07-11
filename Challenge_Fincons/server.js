require('express-group-routes')
const express = require('express');
const { print_routes_list } = require('./utils/server_routes');
const { handlers, emptyHandler } = require('./routes_handlers');
const { Database } = require('./Database');

const app = express();
let mediaTypes = ["series", "movies", "seasons", "episodes", "tv-shows"]
let rootMediaTypes = ["series", "movies", "tv-shows"]
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
app.use(express.json());



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



if (process.argv.length === 3) {
    switch (process.argv[2]) {
        case 'start':
            app.listen(3000, () => {
                Database.Get();
            });
            break;
        case 'routes':
            print_routes_list(app)
            break;
    }
}


module.exports = { app, mediaTypes }