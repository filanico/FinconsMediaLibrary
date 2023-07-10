const { describe, expect, test } = require('@jest/globals')
const { Movie, Episode, Season, Media, Series } = require('../Media')
const { Database } = require('../Database')


describe("Media item", () => {
    test("Converts title to JSON", () => {
        let expected = {
            'title': "Fake title",
        }
        let media = new Episode({ title: "Fake title" });
        expect(media.toJson().title).toBe(expected.title)
    })
    test("Converts originalTitle to JSON", () => {
        let expected = {
            'originalTitle': "Fake originalTitle",
        }
        let media = new Episode({ originalTitle: "Fake originalTitle" });
        expect(media.toJson().originalTitle).toBe(expected.originalTitle)
    })
    test("Converts productionYear to JSON", () => {
        let expected = {
            'productionYear': 2012,
        }
        let media = new Episode({ productionYear: 2012 });
        expect(media.toJson().productionYear).toBe(expected.productionYear)
    })
    test("Converts type to JSON", () => {
        let expected = {
            'type': Media.TYPE_MOVIE,
        }
        let media = new Movie();
        expect(media.toJson().type).toBe(expected.type)
    })
    test("Converts parent to JSON", () => {
        let expected = new Season({ title: "01 Breaking bad" })
        let media = new Movie({ parent: expected });
        expect(media.toJson().parent.title).toBe(expected.title)
    })
    test("Converts children to JSON", () => {
        let expected = [
            new Episode({ title: "Tutto finisce" }),
            new Episode({ title: "La resa dei conti" }),
            new Episode({ title: "Il tradimento" }),
        ]
        let media = new Season({ title: "01 Breaking bad", children: expected });
        expected.forEach((episode, k) => {
            expect(media.toJson().children[k].title).toBe(expected[k].title)
        })
    })
    test("Each media has different ID", () => {
        Media.resetCounter();
        let media = new Episode();
        expect(media.id).toBe(1);
        media = new Season();
        expect(media.id).toBe(2);
        media = new Series();
        expect(media.id).toBe(3);

    })
})

describe("Database", () => {
    test("Add", () => {
        let media = new Movie({ title: "Indiana jones e l'ultima crociata" })
        let db = Database.Get();
        db.add(media);
        expect(db.length()).toBe(1)
    })
    test("Delete", () => {
        let media = new Movie({ title: "Indiana jones e l'ultima crociata" })
        let db = Database.Get();
        db.clear()
        db.add(media);
        expect(db.length()).toBe(1)
        db.remove(media.id)
        expect(db.length()).toBe(0)
    })
    test("setAt 0 and at 0 ", () => {
        let media = new Movie({ title: "Indiana jones e l'ultima crociata" })
        let db = Database.Get();
        db.clear()
        db.setAt(0, media);
        let mediaFromDb = db.at(0);
        expect(media.title).toBe(mediaFromDb.title)
    })
    test("setAt 10 and at 10 ", () => {
        let media = new Movie({ title: "Indiana jones e l'ultima crociata" })
        let db = Database.Get();
        db.clear()
        db.setAt(10, media);
        let mediaFromDb = db.at(10);
        expect(media.title).toBe(mediaFromDb.title)
    })
    test("setAt 10 and at 10 have same id", () => {
        let media = new Movie({ title: "Indiana jones e l'ultima crociata" })
        let db = Database.Get();
        db.clear()
        db.setAt(10, media);
        let mediaFromDb = db.at(10);
        expect(media.id).toBe(mediaFromDb.id)
    })
    test("Works as singleton", () => {
        Database.counter = 1
        Database.Get();
        expect(Database.counter).toBe(1)
        Database.Get();
        expect(Database.counter).toBe(1)
        new Database();
        expect(Database.counter).toBe(1)
    })

    test("Acquires lock", () => {
        let db = Database.Get()
        let lock = db.getLock()
        db.add(new Movie())
        let lock2 = db.getLock()
        db.add(new Movie())
        lock.then(release => release());
    })

    test("Race condition", () => {

    })
})