let emptyHandler = {
    'post': (req, res) => { res.status(404).send("Not yet implemented"); },
    'get': (req, res) => { res.status(404).send("Not yet implemented"); },
    'put': (req, res) => { res.status(404).send("Not yet implemented"); },
    'delete': (req, res) => { res.status(404).send("Not yet implemented"); },
}
let handlers = {
    'series': {
        ...emptyHandler,
        'get': (req, res) => {
            res.sendStatus(200)
        },
    }
}

module.exports = { handlers, emptyHandler }