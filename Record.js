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
    static DEFAULT_CONTENT_TYPE = Record.CONTENT_TYPES.ALL

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
        this.setTitle(record.title ?? undefined);
        this.setProductionYear(record.productionYear ?? undefined)
        this.setOriginalTitle(record.originalTitle ?? undefined)
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
            parent: this.parent ?? null,
        }
    }

    toJson() {
        return this._getJsonObject()
    }
}

module.exports = { Record }