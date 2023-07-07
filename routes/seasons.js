const { SeasonsRepository } = require("../repositories/SeasonsRepository");

module.exports = function (app) {
    /** @type {SeasonsRepository} */
    let seasons = new SeasonsRepository();

    app.group("/seasons", (router) => {
        router.get("/", (req, res) => {
            return res.json(
                seasons.all().map(x => x.toJson())
            )
        })
        router.post("/", (req, res) => {
            let jsonObject = req.body;
            if (!Array.isArray(jsonObject)) {
                jsonObject = [jsonObject]
            }
            let newItems = seasons.createMany(jsonObject);
            res.json(newItems.toJson())
        })

        router.put("/", (req, res) => {
            let updatedItems = req.body
            if (!Array.isArray(updatedItems)) {
                updatedItems = [updatedItems]
            }
            let updatedSeries = seasons.updateMany(updatedItems);
            res.json(updatedSeries)
        })

        router.delete("/:id", (req, res) => {
            let isDeleted = seasons.delete(req.params.id);
            res.json(isDeleted)
        })

        router.get("/:id/seasons", (req, res) => {
            let item = seasons.get(req.params.id);
            res.json(
                item.seasons.toJson()
            )
        })

        router.get("/:id/episodes", (req, res) => {
            /** @type Series */
            let _series = seasons.get(req.params.id);

            res.json(
                _series
                    .seasons
                    .all()
                    .map(_record => (new Season(_record))._episodes.toJson())
            )
        })

        router.post("/:id/seasons", (req, res) => {
            let _series = seasons.get(req.params.id);
            let newSeason = Season.fromJson(req.body);
            _seasons.seasons.add(newSeason)
            res.json(
                newSeason
            )
        })

        router.delete("/:id/seasons/:seasonId", (req, res) => {
            let _series = seasons.get(req.params.id);
            let seasonFromCatalog = catalog.get(req.params.seasonId);
            _seasons.seasons.delete(req.params.seasonId)
            res.json(
                seasonFromCatalog !== undefined
            )
        })
    })
}