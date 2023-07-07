const { MoviesRepository } = require("../repositories/MoviesRepository");

module.exports = function (app) {
    let movies = new MoviesRepository();

    app.group("/movies", (router) => {
        router.get("/", (req, res) => {
            return res.json(
                movies.all().map(x => x.toJson())
            )
        })


        router.post("/", (req, res) => {
            let jsonObject = req.body;
            if (!Array.isArray(jsonObject)) {
                jsonObject = [jsonObject]
            }
            let newItems = movies.createMany(jsonObject);
            res.json(newItems.toJson())
        })

        router.put("/", (req, res) => {
            let updatedItems = req.body
            if (!Array.isArray(updatedItems)) {
                updatedItems = [updatedItems]
            }
            let updatedSeries = movies.updateMany(updatedItems);
            res.json(updatedSeries)
        })


        router.delete("/:id", (req, res) => {
            let isDeleted = movies.delete(req.params.id);
            res.json(isDeleted)
        })



    });
}