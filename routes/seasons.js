module.exports = function (app) {
    app.group("/seasons", (router) => {
        router.get("/", (req, res) => {
            return res.json(repository.getSeries())
        })
        router.get("/all", (req, res) => {
            return res.json(
                seasons.all().map(x => x.toJson())
            )
        })
        router.post("/create", (req, res) => {
            let jsonObject = req.body;
            seasons.create(jsonObject);
            res.json(1)
        })
    })
}