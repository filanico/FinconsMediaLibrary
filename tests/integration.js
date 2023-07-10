
const request = require('supertest');
const { it } = require('jest');
const { mediaTypes, app } = require('../Server');


describe("When hitting GET / of ", () => {
    mediaTypes.forEach((mediaType) => {
        it(mediaType + " returns 200", () => {
            request(app)
                .get("/")
                .expect(200)
        })
    })
})