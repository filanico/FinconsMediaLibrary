const express = require('express');
const app = express();
const { Season, Series, Episode } = require('./MediaItems');
const { Repository } = require('./Repository');
const port = 3002;
const DEFAULT_DB_FILEPATH = 'repository.json';


let repository = new Repository(DEFAULT_DB_FILEPATH);
// let series = new Series({ title: "Rookie" })
// repository.createSeries({
//     title: "Rookie"
// })
// repository.persist()

// let [rookie] = repository.getSeries({ productionYear: 0 });
let rookie = new Series({ title: "Rookie" })
// rookie.getSeasons()[0].removeEpisode()

let seasonOne = new Season({ title: "Rookie stagione 01" })

let episode = new Episode()
episode.setTitle("01 Pilot").setOriginalTitle("01 The beginning").setProductionYear(2001)

seasonOne.addEpisode(episode)
rookie.addSeason(seasonOne)

repository.deleteSeries(rookie);
console.log(rookie.title);
// rookie.addSeason(seasonOne);
// repository.persist()

// console.log(rookie);
// repository.movies.findByTitle("Rookie");
app.use(express.json())
app.get("/series", (req, res) => {
    return res.json(repository.getSeries())
})
app.post("/series", (req, res) => {
    let payload = req.body;
    repository.createSeries
    res.json(payload);
})

app.listen(port, () => {
    console.log("MediaServer listening on port " + port);
})