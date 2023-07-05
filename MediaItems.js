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

    /**
     * 
     * @param {Record} record 
     */
    update(record) {
        for( key in record ) {
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

    static fromJson(json) {
        return (new Record())
            .setOriginalTitle(json.originalTitle)
            .setTitle(json.title)
            .setProductionYear(json.productionYear)
    }
}

class Episode extends Record {
    constructor(...params) {
        super(params)
        this._setContentType(Record.CONTENT_TYPES.EPISODE)
    }
}

class MultiEpisodesContent extends Record {
    /** @type Records */
    #episodes = new Records()

    get episodes() {
        return this.#episodes
    }

    constructor({ title = undefined, originalTitle = undefined, contentType = undefined, productionYear = undefined }) {
        super({ title, originalTitle, contentType, productionYear });
        this._setContentType(Record.CONTENT_TYPES.SEASON)
    }

    _getJsonObject() {
        return { ...super._getJsonObject() }
    }
}

class MultiSeasonsContent extends Record {
    /** @type Records */
    #seasons = new Records()

    get seasons() {
        return this.#seasons
    }

    constructor({ title = undefined, originalTitle = undefined, contentType = undefined, productionYear = undefined }) {
        super({ title, originalTitle, contentType, productionYear });
        this._setContentType(Record.CONTENT_TYPES.SERIES)
    }

    _getJsonObject() {
        return { ...super._getJsonObject(), seasons: [...this.toJson()] }
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
        let [item] = this.#items.filter(item => item.id === id)
        return item;
    }

    /**
     * 
     * @param {*} param0 
     * @returns {[Record]}
     */
    find({ title = undefined, originalTitle = undefined, productionYear = undefined }) {
        return this.#items.filter(item => {
            return (
                (title !== undefined && item.title === title) ||
                (originalTitle !== undefined && item.originalTitle === originalTitle) ||
                (productionYear !== undefined && item.productionYear === productionYear) ||
                false
            )
        })
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
    remove(recordOrId) {
        let id = recordOrId instanceof Record ? recordOrId.id : recordOrId;
        this.#items = this.#items.filter(item => item.id !== id)
        return this
    }

    find() { }

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