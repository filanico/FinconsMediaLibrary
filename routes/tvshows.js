const { TvShowsRepository } = require("../repositories/TvShowsRepository")

module.exports = function (app) {
    let tvShows = new TvShowsRepository()

    app.group("/tv-shows", (router) => {
        router.get("/", (req, res) => {
            return res.json(
                tvShows.all().map(x => x.toJson())
            )
        })

        router.post("/", (req, res) => {
            let jsonObject = req.body;
            if (!Array.isArray(jsonObject)) {
                jsonObject = [jsonObject]
            }
            let newItems = tvShows.createMany(jsonObject);
            res.json(newItems.toJson())
        })

        router.put("/", (req, res) => {
            let updatedItems = req.body
            if (!Array.isArray(updatedItems)) {
                updatedItems = [updatedItems]
            }
            let updatedSeries = tvShows.updateMany(updatedItems);
            res.json(updatedSeries)
        })

        router.delete("/:id", (req, res) => {
            let isDeleted = tvShows.delete(req.params.id);
            res.json(isDeleted)
        })

    })
}