
const request = require('supertest');
require('jest');
const { mediaTypes, app } = require('../Server');

describe("When hitting GET / of ", () => {
    mediaTypes.forEach((mediaType) => {
        test(mediaType + " returns 200", async () => {
            await request(app)
                .get("/" + mediaType)
                .expect(200)
        })
    })
})