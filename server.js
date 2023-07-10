const express = require('express')

const app = express();
const mediaTypes = ["series", "movies", "seasons", "episodes", "tv-shows"]

app.use(express.json());

mediaTypes.forEach(mediaType => {
    app.group(mediaType, () => {
        app.get("/", (req, res) => {
            res.send("List of " + mediaType, 200)
        })
    })
})

module.exports = { app, mediaTypes }