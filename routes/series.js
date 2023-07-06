const { SeriesRepository } = require("../Repositories");
const { Series, Season } = require("../MediaItems");

/**
 * 
 * @param {*} app 
 * @param {SeriesRepository} series 
 */
module.exports = function (app, series) {
    app.group("/series", (router) => {
        
        router.get("/", (req, res) => {
            return res.json(
                series.all().map(x => x.toJson())
            )
        })

        router.post("/", (req, res) => {
            let jsonObject = req.body;
            series.create(jsonObject);
            res.json(1)
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
                    .map(_record => (new Season(_record))._episodes.toJson()  )
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