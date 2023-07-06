module.exports = function (app) {
    app.group("/tvshows", (router) => {
        router.get("/all", (req, res) => {
            return res.json(
                tvShows.all().map(x => x.toJson())
            )
        })
        router.post("/create/", (req, res) => {
            console.log(req.params.parentId);
            let jsonObject = req.body;
            tvShows.create(jsonObject);
            res.json(1)
        })

    })
}