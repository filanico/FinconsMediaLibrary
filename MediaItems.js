class Record {
    static CONTENT_TYPES = {
        'ALL': 'ALL',
        'SERIES': 'SERIES',
        'SEASON': 'SEASON',
        'EPISODE': 'EPISODE',
        'MOVIE': 'MOVIE',
        'TVSHOW': 'TVSHOW'
    };
    static ID = 1;
    #id = -1
    #title = undefined
    #originalTitle = undefined
    #contentType = undefined
    #productionYear = undefined
    constructor(_title = undefined, _originalTitle = undefined, _contentType = undefined, _productionYear = undefined) {
        this.#title = _title;
        this.#originalTitle = _originalTitle;
        this.#productionYear = _productionYear;
        this.contentType = _contentType;
        this.#id = Record.ID++
    }

    static _isLegalContentType(_contentType) {
        return Object.values(Record.CONTENT_TYPES).includes(_contentType);
    }

    setTitle(_title) {
        this.#title = _title;
        return this;
    }

    setOriginalTitle(_originalTitle) {
        this.#originalTitle = _originalTitle;
        return this;
    }

    _setContentType(_contentType) {
        this.contentType = _contentType;
        return this;
    }

    setProductionYear(_productionYear) {
        this.#productionYear = _productionYear;
        return this;
    }

    get id() {
        return this.#id;
    }

    get contentType() {
        return this.#contentType;
    }

    get title() {
        return this.#title;
    }

    set contentType(_newValue) {
        if (_newValue !== undefined) {
            if (!Record._isLegalContentType(_newValue)) {
                this.throwIllegalContentType(_newValue);
            }
            this.#contentType = _newValue;
        }
    }
    //_ Throws 
    throwIllegalContentType(_contentType) {
        throw new Error(`'${_contentType}' is not listed among possible contentTypes`);
    }
    throwInvalidContentType(_contentType) {
        const _objectType = typeof (this);
        throw new Error(`'${_contentType}' is not a valid contentType for this ${_objectType} record`);
    }

    _getJsonObject() {
        return {
            title: this.#title,
            originalTitle: this.#originalTitle,
            productionYear: this.#productionYear,
            contentType: this.#contentType,
        }
    }

    toJson() {
        return this._getJsonObject()
    }
}

class Episode extends Record {
    constructor(...params) {
        super(params)
        this._setContentType(Record.CONTENT_TYPES.EPISODE)
    }
}

class MultiEpisodesContent extends Record {
    #episodes = []
    constructor({ title = undefined, originalTitle = undefined, contentType = undefined, productionYear = undefined }) {
        super({ title, originalTitle, contentType, productionYear });
        this._setContentType(Record.CONTENT_TYPES.SEASON)
    }

    // get episodes() {
    //     return this.#episodes;
    // }
    /**
     * 
     * @returns {[Episode]}
     */
    getEpisodes() {
        return this.#episodes
    }
    /**
     * 
     * @param {Episode} _episode 
     */
    addEpisode(_episode) {
        this.#episodes.push(_episode);
    }
    /**
     * 
     * @param {Episode} _episode 
     */
    removeEpisode(_episode) {
        const cleared = this.#episodes
            .filter(foo => !this.#episodes.includes(_episode))
        this.#episodes = [...cleared]
    }

    _getJsonObject() {
        return { ...super._getJsonObject(), episodes: [...this.#episodes.map(e => e._getJsonObject())] }
    }
}

class MultiSeasonsContent extends Record {
    #seasons = []

    constructor({ title = undefined, originalTitle = undefined, contentType = undefined, productionYear = undefined }) {
        super({ title, originalTitle, contentType, productionYear });
        this._setContentType(Record.CONTENT_TYPES.SERIES)
    }
    /**
     * 
     * @param {*} param0 
     * @returns {[Season]}
     */
    getSeasons() {
        return this.#seasons
    }
    /**
     * 
     * @returns {[MultiSeasonsContent]}
     */
    addSeason(_season) {
        this.#seasons.push(_season);
        return this;
    }
    /**
     * 
     * @returns {[MultiSeasonsContent]}
     */
    addSeasons(_seasons) {
        _seasons.forEach(s => this.addSeasons(s))
        return this;
    }
    removeSeason(_season) {
        const cleared = this.#seasons
            .filter(foo => !this.#seasons.includes(_season))
        this.#seasons = [...cleared]
    }
    _getJsonObject() {
        return { ...super._getJsonObject(), seasons: [...this.#seasons.map(e => e._getJsonObject())] }
    }
}

class Season extends MultiEpisodesContent {

}

class Movie extends MultiEpisodesContent {

}

class Series extends MultiSeasonsContent {
    constructor({ title = undefined, originalTitle = undefined, contentType = undefined, productionYear = undefined }) {
        super({ title, originalTitle, contentType, productionYear });
    }
    static fromJson(json) {
        return (new Series())
            .setOriginalTitle(json.originalTitle)
            .setTitle(json.title)
            .setProductionYear(json.productionYear)
            .addSeasons(json.seasons)
    }
}

class TvShow extends MultiSeasonsContent {
}




// let e = new Episode()

// e
//     .setTitle("01 Pilot")
//     .setProductionYear(2018)
//     ;
// let ssn = new Season()

// ssn
//     .setTitle("01 Prima stagione")
//     .addEpisode(e)
//     ;

// let s = new Series();
// s
//     .setTitle("Breaking Bad")
//     .setProductionYear(2018)
//     .addSeason(ssn)

// console.log(s.toJson());

module.exports = { Record, Episode, Season, Movie, Series, TvShow, MultiEpisodesContent, MultiSeasonsContent }