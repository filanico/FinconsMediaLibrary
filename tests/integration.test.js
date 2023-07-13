
const request = require('supertest');
require('jest');
const { app } = require('../Server');
const { Series, Media, Episode, Movie, Season, TvShow } = require('../Media');
const { Database } = require('../Database');
const { TYPES_CLASS, TYPE_ROUTE } = require('../utils/maps');
const { fork, ChildProcess } = require('child_process')
const mediaTypes = Media.TYPES
/** @type {ChildProcess} */
let pDb = null;

beforeAll((done) => {
    pDb = fork('./services/database.process')
    pDb.on('message', ({ replyTo }) => {
        if (replyTo === 'init') {
            done()
        }
    });
    pDb.send({ action: 'init' })
})

afterAll(() => {
    pDb.kill()
})

function queryDb(message) {
    return new Promise((ok) => {
        pDb.on('message', ({ replyTo, payload }) => {
            if (replyTo === message.action) {
                ok({ payload })
            }
        });
        pDb.send(message)
    })
}

describe("When creating and getting a media by id of ", () => {
    // let mediaType = 'SERIES';
    [mediaTypes].forEach(mediaType => {
        test(mediaType + " returns 200", (done) => {
            let mediaTypeClass = TYPES_CLASS[mediaType]
            let message = { action: 'post', mediaType, payload: (new mediaTypeClass()).toJson() }
            queryDb(message).then(({ payload }) => {
                let mediaRouteName = TYPE_ROUTE[mediaType]
                request(app)
                    .get(["", mediaRouteName, payload.id].join("/"))
                    .expect(200)
                    .then((response) => {
                        let json = response.body;
                        expect(json.id).toBe(payload.id)
                        done()
                    })
                    ;
            }).catch(error => expect(error).toBe(0))
        })
    });
    // Promise.all(mediaTypes.map((mediaType) => {
    // new Promise((testOk) => {
    //     test(mediaType + " returns 200", async () => {
    //         let dbResponse = new Promise((ok) => {
    //             let mediaTypeClass = TYPES_CLASS[mediaType]
    //             let message = { action: 'post', mediaType, payload: (new mediaTypeClass()).toJson() }
    //             pDb.on('message', async ({ replyTo, payload }) => {
    //                 let mediaRouteName = TYPE_ROUTE[mediaType]
    //                 let response = await request(app)
    //                     .get(["", mediaRouteName, media.id].join("/"))
    //                     .expect(200);
    //                 db.remove(media.id);
    //                 let json = response.body;
    //                 expect(json.id).toBe(media.id)
    //                 ok()
    //             })
    //             pDb.send(message)
    //         });
    //         await dbResponse;
    //         testOk()
    //     })
    // })
    // }))
})

describe("Database instance", () => {
    test("online", (done) => {
        let action = 'healthCheck';
        queryDb({ action }).then(({ payload }) => {
            try {
                expect(payload.status.itemsCount).toBe(0)
            } catch (error) {
                expect(error).toBe(1)
            } finally {
                done()
            }
        })
    })
});


describe("When updating media of type", () => {
    Object.entries(TYPES_CLASS).forEach(([mediaType, mediaTypeClass]) => {
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


describe("Batch add", () => {
    test("Series", (done) => {
        let payload = [
            { title: "Breaking bad" },
            { title: "Chips" },
            { title: "Rookie" },
            { title: "S.W.A.T" },
        ]
        let r = request(app)
            .post(['', 'series', 'batch'].join("/"))
            .send(payload)
            .expect(200)

            .then(r => {
                expect(r.body.length).toBe(4)
                done()
            })


        // let db = Database.Get()
        // let seriesFromDb = db.findAllOf(Series)
        // expect(seriesFromDb.length).toBe(4)
    })

})
