const { parentPort } = require('worker_threads');
const { Database } = require('../Database');
const { Series, TvShow, Season, Episode, Movie, MultiSeasonMedia } = require("../Media");
const { TYPES_CLASS } = require("../utils/maps");

parentPort.on('message', ([json, mediaType]) => {
    const mediaTypeClass = TYPES_CLASS[mediaType]
    // const mediaTypeClass = Series
    run(json, mediaTypeClass).then(result => {
        parentPort.postMessage(result);
    });
})

function run(jsonArray, mediaTypeClass) {
    return new Promise((ok) => {
        let db = Database.Get()
        db.getLock().then(release => {
            /** @type {[Media]} */
            let result = [];
            jsonArray.forEach(json => {
                result.push(mediaTypeClass.fromJson(db.add(mediaTypeClass.fromJson(json))))
            })
            release()
            ok(result.map(media => media.toJson()))
        })
    });
}