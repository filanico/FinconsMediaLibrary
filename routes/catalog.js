const { AbstractRepository } = require("../Repositories")

module.exports = function (app) {
    app.group("/episodes", (router) => {
        router.get("/all", (req, res) => {
            return res.json(
                episodes.all().map(x => x.toJson())
            )
        })
        router.post("/create/", (req, res) => {
            console.log(req.params.parentId);
            let jsonObject = req.body;
            episodes.create(jsonObject);
            res.json(1)
        })
    })
}