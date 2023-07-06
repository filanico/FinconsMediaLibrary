module.exports = function (app) {
    app.group("/series", (router) => {

        router.get("/", (req, res) => {
            return res.json(repository.getSeries())
        })

        router.get("/all", (req, res) => {
            return res.json(
                series.all().map(x => x.toJson())
            )
        })

        router.post("/create", (req, res) => {
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

        router.post("/:id/seasons", (req, res) => {
            let _series = series.get(req.params.id);
            let newSeason = Season.fromJson(req.body);
            _series.seasons.add(newSeason)
            res.json(
                newSeason
            )
        })

        router.post("/:id/seasons/:seasonId", (req, res) => {
            let _series = series.get(req.params.id);
            let seasonFromCatalog = catalog.get(req.params.seasonId);
            _series.seasons.add(seasonFromCatalog)
            res.json(
                seasonFromCatalog
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