
const request = require('supertest');
require('jest');
const { mediaTypes, app } = require('../Server');
const { Series } = require('../Media');

describe("When hitting GET / of ", () => {
    mediaTypes.forEach((mediaType) => {
        test(mediaType + " returns 200", async () => {
            await request(app)
                .get("/" + mediaType)
                .expect(200)
        })
    })
})


describe("When Creating media of type", () => {
    test("series", async () => {
        let series = new Series({ title: "Breaking bad" })
        await request(app)
            .post("/series")
            .set(series.toJson())
            .expect(200)
    })
})