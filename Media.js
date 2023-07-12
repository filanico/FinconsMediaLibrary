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

    constructor({ id = undefined, title = undefined, originalTitle = undefined, type = undefined, productionYear = 0, parent = null, children = [] }) {
        this.id = id ?? Media.#ID++
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

    updateFromJson(jsonObject) {
        Object.entries(jsonObject)
            .filter(entry => entry[1] === undefined)
            .map(entry => entry[0])
            .forEach(undefinedProperty => delete jsonObject[undefinedProperty])
        this.title = jsonObject.title ?? undefined
        this.originalTitle = jsonObject.originalTitle ?? this.originalTitle
        this.productionYear = jsonObject.productionYear ?? this.productionYear
    }

    static fromJson(jsonObject = null, Class = Media) {
        return jsonObject ? new Class(jsonObject) : null
    }

    static resetID() {
        Media.#ID = 1;
    }

    static get ID() {
        return Media.#ID;
    }
    /**
     * 
     * @param {number} count 
     */
    static setID(count) {
        Media.#ID = count;
    }
}
class MultiSeasonMedia extends Media {
    constructor(details) {
        super(details)
    }
    /**
     * @returns {[Season]}
     */
    get seasons() {
        return this.children;
    }
    /**
     * 
     * @param {JSON} media 
     */
    updateFromJson(jsonObject) {
        super.updateFromJson(jsonObject)
        parent = null
        this.children = jsonObject.children.map(jsonChild => Season.fromJson(jsonChild))
    }

    /**
     * @param seasons {[Season]} 
     */
    appendSeasons(seasons) {
        this.children = [...this.children, ...seasons.map(_json => Season.fromJson(_json))]
    }
    detachSeasons(seasons) {
        this.children = [...this.children.filter(_season => !seasons.map(deletingSeason => deletingSeason.id).includes(_season.id))]
    }
    updateSeasons(incomingSeasons) {
        incomingSeasons.forEach(incomingSeason => {
            let [season] = this.children.filter(currentSaeason => currentSaeason.id === incomingSeason.id);
            season.updateFromJson(incomingSeason)
        })
    }
}
class MultiEpisodeMedia extends Media {
    /**
     * 
     * @param {JSON} media 
     */
    updateFromJson(jsonObject) {
        super.updateFromJson(jsonObject)
        this.parent = MultiSeasonMedia.fromJson(jsonObject.parent ?? null)
        this.children = (jsonObject.children ?? []).map(jsonChild => Episode.fromJson(jsonChild))
    }

    /**
     * @param episodes {[JsonObject]} 
     */
    appendEpisodes(episodes) {
        this.children = [...this.children, ...episodes.map(_json => Episode.fromJson(_json))]
    }
    detachEpisodes(episodes) {
        this.children = [...this.children.filter(_episodes => !episodes.map(deletingEpisode => deletingEpisode.id).includes(_episodes.id))]
    }
    updateEpisodes(incomingEpisodes) {
        incomingEpisodes.forEach(incomingEpisode => {
            let [season] = this.children.filter(currentSaeason => currentSaeason.id === incomingEpisode.id);
            season.updateFromJson(incomingEpisode)
        })
    }
}
class Episode extends Media {
    constructor(details) {
        super({ ...details, type: Media.TYPE_EPISODE })
    }
    static fromJson(jsonObject) {
        return super.fromJson(jsonObject, Episode);
    }
}
class Movie extends MultiEpisodeMedia {
    constructor(details) {
        super({ ...details, type: Media.TYPE_MOVIE })
    }
    static fromJson(jsonObject) {
        return super.fromJson(jsonObject, Movie);
    }
}
class TvShow extends MultiSeasonMedia {
    constructor(details) {
        super({ ...details, type: Media.TYPE_TVSHOW })
    }
    static fromJson(jsonObject) {
        return super.fromJson(jsonObject, TvShow);
    }
}
class Series extends MultiSeasonMedia {
    constructor(details) {
        super({ ...details, type: Media.TYPE_SERIES })
    }
    static fromJson(jsonObject) {
        return super.fromJson(jsonObject, Series);
    }

}
class Season extends MultiEpisodeMedia {
    constructor(details) {
        super({ ...details, type: Media.TYPE_SEASON })
    }
    static fromJson(jsonObject) {
        return super.fromJson(jsonObject, Season);
    }

}



module.exports = { Media, Episode, Movie, TvShow, Series, Season, MultiEpisodeMedia, MultiSeasonMedia }