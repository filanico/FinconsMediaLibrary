
const request = require('supertest');
require('jest');
const { mediaTypes, app } = require('../Server');
const { Series, Media, Episode, Movie, Season, TvShow } = require('../Media');
const { Database } = require('../Database');
const TYPES_AND_CLASSES = {
    'episodes': Episode,
    'movies': Movie,
    'seasons': Season,
    'series': Series,
    'tv-shows': TvShow,
}

describe("When creating and getting a media by id of ", () => {
    mediaTypes.forEach((mediaType) => {
        let media = new TYPES_AND_CLASSES[mediaType]()
        test(mediaType + " returns 200", async () => {
            let db = Database.Get();
            db.add(media);
            let response = await request(app)
                .get(["", mediaType, media.id].join("/"))
                .expect(200);
            db.remove(media.id);
            let json = response.body;
            expect(json.id).toBe(media.id)
        })

    })
})
describe("When updating media of type", () => {
    Object.entries(TYPES_AND_CLASSES).forEach(([mediaType, mediaTypeClass]) => {
        test(mediaType, async () => {
            // let updatingMediaJson = mediaTypeClass.fromJson({ id: _counter++, title: "updatedTitle" })
            let creatingMedia = new mediaTypeClass({ title: "First title", originalTitle: "original title" })
            let updatingMediaJson = { title: "updatedTitle" }
            let db = Database.Get();
            db.add(creatingMedia);
            // db.update(updatingMediaJson.id, updatingMediaJson)
            let response = await request(app)
                .put(['', mediaType, creatingMedia.id].join("/"))
                .send(updatingMediaJson)
                .expect(200)
            expect(response.body.title).toBe(updatingMediaJson.title)
            expect(response.body.originalTitle).toBe("original title")
        })
    });
})
describe("When appending children of ", () => {
    [
        { mediaType: 'series', className: Series },
        { mediaType: 'tv-shows', className: TvShow },
    ].forEach(_testCase => {
        let { mediaType, className } = _testCase;
        test(mediaType, async () => {
            let newSeries = new className({ title: "Breaking bad" })
            let payload = [
                { "title": "01 Prima stagione Breaking bad" },
                { "title": "02 Seconda stagione Breaking bad" }
            ]
            let db = Database.Get()

            /** @type {Series} */
            let series = db.add(newSeries);

            let response = await request(app)
                .post(['', mediaType, series.id, 'seasons'].join("/"))
                .send(payload)
                .expect(200)

            expect(response.body.children.length).toBe(2)
        })
    })

})
