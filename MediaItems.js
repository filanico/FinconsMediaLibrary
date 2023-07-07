const { json } = require("express");
const { Record } = require("./Record");
const { Records } = require("./Records");


class Episode extends Record {
    static DEFAULT_CONTENT_TYPE = Record.CONTENT_TYPES.EPISODE

    /** @type  {MultiEpisodesContent} */
    _parent = null;

    get parent() {
        return this._parent
    }

    set parent(_newParent) {
        this._parent = _newParent;
    }

    _getContentType() {
        return Record.CONTENT_TYPES.EPISODE;
    }

    static fromJson(json) {
        let instance = new Episode(json)
        return instance;
    }
}

class MultiEpisodesContent extends Record {
    /** @type  {MultiSeasonsContent} */
    _parent = null;

    /** @type Records */
    _episodes = new Records()

    get parent() {
        return this._parent
    }

    set parent(_newParent) {
        this._parent = _newParent;
    }

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
        return this._seasons ?? []
    }

    _getContentType() {
        return Record.CONTENT_TYPES.SERIES;
    }

    static fromJson(json) {
        let [item] = this.fromJsonArray([json]);
        return item;
    }

    static fromJsonArray(jsonArray) {
        return jsonArray.map(_jsonObject => { _jsonObject.seasons = _jsonObject.seasons ?? []; return _jsonObject; })
    }

    update(record) {
        super.update(record)

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


module.exports = { Episode, Season, Movie, Series, TvShow, MultiEpisodesContent, MultiSeasonsContent }

