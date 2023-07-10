const { describe, expect, test } = require('jest')
const { Media } = require('../Media')


describe("Media item", () => {
    test("Converts to JSON", () => {
        let expected = {
            'title': "Fake title",
        }
        let media = new Media({ title: "Fake title" });

        expect(media.toJson().title).toBe(expected.title)

    })
})