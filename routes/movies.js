module.exports = function (app) {
    app.group("/movies", (router) => {
        router.get("/all", (req, res) => {
            return res.json(
                catalog.all().map(x => x.toJson())
            )
        })
    });
}