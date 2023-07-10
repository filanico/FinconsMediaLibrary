let emptyHandler = {
    'post': (req, res) => { res.status(200).send("Not yet implemented"); },
    'get': (req, res) => { res.status(200).send("Not yet implemented"); },
    'put': (req, res) => { res.status(200).send("Not yet implemented"); },
    'delete': (req, res) => { res.status(200).send("Not yet implemented"); },
}
let handlers = {
    'series': {
        ...emptyHandler,
        'get': (req, res) => {
            res.sendStatus(200)
        },
        'post': (req, res) => {
            let json = res.body;
            res.sendStatus(200)
        }
    },
    'episodes': {
        ...emptyHandler
    },
    'seasons': {
        ...emptyHandler
    },
    'tv-shows': {
        ...emptyHandler
    },
    'movies': {
        ...emptyHandler
    },
}

module.exports = { handlers, emptyHandler }