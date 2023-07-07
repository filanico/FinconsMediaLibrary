const { EpisodesRepository } = require("../repositories/EpisodesRepository")

module.exports = function (app) {
    let episodes = new EpisodesRepository()

    app.group("/episodes", (router) => {
        router.get("/", (req, res) => {
            return res.json(
                episodes.all().map(x => x.toJson())
            )
        })

        router.post("/", (req, res) => {
            let jsonObject = req.body;
            if (!Array.isArray(jsonObject)) {
                jsonObject = [jsonObject]
            }
            let newItems = episodes.createMany(jsonObject);
            res.json(newItems.toJson())
        })

        router.put("/", (req, res) => {
            let updatedItems = req.body
            if (!Array.isArray(updatedItems)) {
                updatedItems = [updatedItems]
            }
            let updatedSeries = episodes.updateMany(updatedItems);
            res.json(updatedSeries)
        })

        router.delete("/:id", (req, res) => {
            let isDeleted = episodes.delete(req.params.id);
            res.status(200).json(isDeleted)
        })


    })
}