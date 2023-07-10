require('express-group-routes')
const express = require('express');
const { print_routes_list } = require('./utils/server_routes');
const { handlers, emptyHandler } = require('./routes_handlers');
const { Database } = require('./Database');

const app = express();
let mediaTypes = ["series", "movies", "seasons", "episodes", "tv-shows"]

app.use(express.json());

mediaTypes.forEach(mediaType => {
    let mediaTypeHandler = handlers[mediaType] ?? emptyHandler
    app.group("/" + mediaType, (router) => {
        router.post("/", mediaTypeHandler['post'])
        router.get("/", mediaTypeHandler['get'])
        router.put("/:id", mediaTypeHandler['put'])
        router.delete("/:id", mediaTypeHandler['delete'])
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