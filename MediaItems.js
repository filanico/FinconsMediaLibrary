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

    constructor({ title = undefined, originalTitle = undefined, contentType = undefined, productionYear = undefined, id = undefined }) {
        this.#title = title;
        this.#originalTitle = originalTitle;
        this.#productionYear = productionYear;
        this.contentType = contentType ?? this._getContentType();
        this.id = id
    }

    _getContentType() {
        return Record.CONTENT_TYPES.ALL;
    }

    /**
     * 
     * @param {Record} record 
     */
    update(record) {
        for (key in record) {
            console.log(key);
            process.exit();
        }
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

    set id(_newId) {
        this.#id = _newId ?? Record.ID++
    }

    get contentType() {
        return this.#contentType;
    }

    get title() {
        return this.#title;
    }

    get originalTitle() {
        return this.#originalTitle;
    }

    get productionYear() {
        return this.#productionYear;
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
            id: this.id,
            title: this.title,
            originalTitle: this.originalTitle,
            productionYear: this.productionYear,
            contentType: this.contentType,
        }
    }

    toJson() {
        return this._getJsonObject()
    }
}

class Episode extends Record {
    _getContentType() {
        return Record.CONTENT_TYPES.EPISODE;
    }

    static fromJson(json) {
        let instance = new Episode(json)
        return instance;
    }

}

class MultiEpisodesContent extends Record {
    /** @type Records */
    _episodes = new Records()

    get episodes() {
        return this._episodes
    }

    _getContentType() {
        return Record.CONTENT_TYPES.SEASON;
    }

    toJson() {
        return { ...super.toJson(), episodes: this.episodes.toJson() }
    }

    static fromJson(jsonObject) {
        jsonObject.episodes = jsonObject.episodes ?? []
        return jsonObject
    }

}

class MultiSeasonsContent extends Record {
    /** @type Records */
    _seasons = new Records()

    get seasons() {
        return this._seasons
    }

    _getContentType() {
        return Record.CONTENT_TYPES.SERIES;
    }

    static fromJson(jsonObject) {
        jsonObject.seasons = jsonObject.seasons ?? [];
        return jsonObject;
    }

    toJson() {
        return { ...super.toJson(), seasons: this.seasons.toJson() }
    }
}

class Season extends MultiEpisodesContent {
    constructor(config) {
        super({ ...config })
    }
    /**
     * 
     * @param  json 
     * @returns 
     */
    static fromJson(json) {
        json = super.fromJson(json);
        let instance = new Season(json)
        instance._episodes = new Records(json.episodes.map(_jsonEpisode => Episode.fromJson(_jsonEpisode)))
        return instance;
    }
}

class Movie extends MultiEpisodesContent {
    /**
     * 
     * @param  json 
     * @returns 
     */
    static fromJson(json) {
        json = super.fromJson(json);
        let instance = new Movie(json)
        instance._episodes = new Records(json.episodes.map(_jsonEpisode => Episode.fromJson(_jsonEpisode)))
        return instance;
    }
}

class Series extends MultiSeasonsContent {
    static fromJson(json) {
        json = super.fromJson(json);
        let instance = new Series(json)
        instance._seasons = new Records(json.seasons.map(_jsonSeason => Season.fromJson(_jsonSeason)))
        return instance;
    }
}

class TvShow extends MultiSeasonsContent {

    _getContentType() {
        return Record.CONTENT_TYPES.TVSHOW;
    }

    static fromJson(json) {
        json = super.fromJson(json);
        let instance = new TvShow(json)
        instance._seasons = new Records(json.seasons.map(_jsonSeason => Season.fromJson(_jsonSeason)))
        return instance;
    }
}

class Records {
    /** @type {[Record]} */
    #items = null

    /**
     * 
     * @param {[Record]} _items 
     */
    constructor(_items = []) {
        this.#items = [..._items]
    }

    /**
     * @return {[Record]}
     */
    all() {
        return this.#items
    }

    /**
     * 
     * @return {[Records]}
     * @param {number} id 
     */
    get(id) {
        let [item] = this.#items.filter(item => item.id == id)
        return item;
    }

    /**
     * 
     * @param {*} filters 
     * @returns {[Record]}
     */
    find({ title = undefined, originalTitle = undefined, productionYear = undefined, contentType = undefined }) {
        return this.#items.filter(item => {
            return (
                (contentType !== undefined && contentType === Record.CONTENT_TYPES.ALL)
                ||
                (
                    (title !== undefined && item.title === title) ||
                    (originalTitle !== undefined && item.originalTitle === originalTitle) ||
                    (productionYear !== undefined && item.productionYear === productionYear) ||
                    (contentType !== undefined && item.contentType === contentType) ||
                    false
                )
            )
        });
    }

    /**
     * 
     * @return {Records}
     * @param {Record} record 
     */
    add(record) {
        this.#items.push(record)
        return this
    }

    /**
     * 
     * @return {Records}
     */
    clear() {
        this.#items = []
        return this
    }

    /**
     * @return {Records}
     * @param {Record|number} recordOrId 
    */
    delete(recordOrId) {
        let id = recordOrId instanceof Record ? recordOrId.id : recordOrId;
        this.#items = this.#items.filter(item => item.id != id)
        return this
    }

    /**
     * 
     * @return {Records}
     * @param {[Record]} records 
    */
    batchAdd(records) {
        records.forEach(record => this.add(record))
        return this
    }

    /**
     * 
     * @return {Records}
     * @param {[Record]} records 
    */
    batchRemove(records) {
        records.forEach(record => this.remove(record))
        return this
    }

    /**
     * 
     * @param {[Record]} records 
    */
    batchUpdate() { }

    toJson() {
        return this.#items.map(item => item.toJson())
    }

    /**
     * 
     * @param {[Record]} jsonArray 
     */
    static fromJson(jsonArray) {
        return jsonArray.map(jsonItem => Record.fromJson(jsonItem))
    }



}


module.exports = { Record, Records, Episode, Season, Movie, Series, TvShow, MultiEpisodesContent, MultiSeasonsContent }