const fs = require("fs");
const { Series, Season } = require("../MediaItems");
const { SeriesRepository } = require("../repositories/SeriesRepository");
const { networkInterfaces } = require("os");

/** @type {SeriesRepository} */
let series = new SeriesRepository();


function log(message) {
    let filepath = "server.log";
    fs.appendFileSync(filepath, JSON.stringify(message));
}

/**
 * 
 * @param {*} app 
 */
module.exports = function (app) {
    app.group("/series", (router) => {

        router.get("/", (req, res) => {
            log({ route: "/series" });
            return res.json(
                series.all().map(x => x.toJson())
            )
        })

        router.post("/", (req, res) => {
            let jsonObject = req.body;
            if (!Array.isArray(jsonObject)) {
                jsonObject = [jsonObject]
            }
            let newItems = series.createMany(jsonObject);
            res.json(newItems.toJson())
        })

        router.put("/", (req, res) => {
            let updatedItems = req.body
            if (!Array.isArray(updatedItems)) {
                updatedItems = [updatedItems]
            }
            let updatedSeries = series.updateMany(updatedItems);
            res.json(updatedSeries)
        })

        router.delete("/:id", (req, res) => {
            let isDeleted = series.delete(req.params.id);
            res.json(isDeleted)
        })

        router.get("/:id/seasons", (req, res) => {
            let item = series.get(req.params.id);
            res.json(
                item.seasons.toJson()
            )
        })

        router.get("/:id/episodes", (req, res) => {
            /** @type Series */
            let _series = series.get(req.params.id);

            res.json(
                _series
                    .seasons
                    .all()
                    .map(_record => (new Season(_record))._episodes.toJson())
            )
        })

        router.post("/:id/seasons", (req, res) => {
            let _series = series.get(req.params.id);
            let newSeason = Season.fromJson(req.body);
            _series.seasons.add(newSeason)
            res.json(
                newSeason
            )
        })

        router.delete("/:id/seasons/:seasonId", (req, res) => {
            let _series = series.get(req.params.id);
            let seasonFromCatalog = catalog.get(req.params.seasonId);
            _series.seasons.delete(req.params.seasonId)
            res.json(
                seasonFromCatalog !== undefined
            )
        })

    });
}