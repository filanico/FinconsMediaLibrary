class Media {
    static #ID = 1;
    static TYPE_EPISODE = 'EPISODE';
    static TYPE_MOVIE = 'MOVIE';
    static TYPE_TVSHOW = 'TV-SHOW';
    static TYPE_SEASON = 'SEASON';
    static TYPE_SERIES = 'SERIES';

    static TYPES = [
        Media.TYPE_EPISODE,
        Media.TYPE_MOVIE,
        Media.TYPE_SEASON,
        Media.TYPE_SERIES,
        Media.TYPE_TVSHOW
    ]

    id = -1
    type = "";
    title = "";
    originalTitle = "";
    productionYear = -1;

    /** @type Media */
    parent = null

    /** @type [Media] */
    children = []

    constructor({ title = "Not specified", originalTitle = "Not specified", type = undefined, productionYear = 0, parent = null, children = [] }) {
        this.id = Media.#ID++
        this.title = title;
        this.originalTitle = originalTitle;
        this.type = type;
        this.productionYear = productionYear;
        this.parent = parent;
        this.children = [...children]
    }

    toJson() {
        return {
            id: this.id,
            title: this.title,
            originalTitle: this.originalTitle,
            type: this.type,
            productionYear: this.productionYear,
            parent: this.parent ? this.parent.toJson() : null,
            children: this.children.map(item => item.toJson())
        }
    }

    static fromJson(jsonObject) {
        return new Media(jsonObject)
    }

    static resetCounter() {
        Media.#ID = 1;
    }
}

class Episode extends Media {
    constructor(details) {
        super({ ...details, type: Media.TYPE_EPISODE })
    }
}
class Movie extends Media {
    constructor(details) {
        super({ ...details, type: Media.TYPE_MOVIE })
    }
}
class TvShow extends Media {
    constructor(details) {
        super({ ...details, type: Media.TYPE_TVSHOW })
    }
}
class Series extends Media {
    constructor(details) {
        super({ ...details, type: Media.TYPE_SERIES })
    }
}
class Season extends Media {
    constructor(details) {
        super({ ...details, type: Media.TYPE_SEASON })
    }
}


module.exports = { Media, Episode, Movie, TvShow, Series, Season }