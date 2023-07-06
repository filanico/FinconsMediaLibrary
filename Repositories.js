const fs = require('fs');
const { Series, MultiSeasonsContent, Season, TvShow, Movie, Record, Episode, MultiEpisodesContent, Records } = require('./MediaItems');

class AbstractRepository {

    /** @type {Records} */
    static _data = null

    constructor() {
        AbstractRepository._data = new Records()
    }

    /**
     * @param {*} jsonObject 
     * @returns {Record}
     */
    create(jsonObject) {
        return Record.fromJson(jsonObject);
    }

    all() {
        return AbstractRepository._data.find({ contentType: Record.CONTENT_TYPES.ALL })
    }

    /**
     * 
     * @param {Record} id 
     * @returns 
     */
    get(id) {
        return AbstractRepository._data.get(id)
    }

    delete(id) {
        AbstractRepository._data = AbstractRepository._data.filter(_item => _item.id !== id)
    }
    /**
     * 
     * @param {number} id 
     * @param {*} jsonObject 
     * @returns {Record}
     */
    update(id, jsonObject) {
        let item = this.get(id);
        return item;
    }
    /**
     * 
     * @returns {AbstractRepository}
     */
    clear() {
        AbstractRepository._data = []
        return this
    }

    /**
     * 
     */
    toJson() {
        return AbstractRepository._data.toJson()
    }
}

class EpisodesRepository extends AbstractRepository {
    /**
     * @param {*} jsonObject 
     * @param {MultiEpisodesContent} parent 
     * @returns {Episode}
     */
    create(jsonObject, parent = undefined) {
        let episode = Episode.fromJson(jsonObject);
        if (parent !== undefined) {
            parent.episodes.add(episode)
        }
        AbstractRepository._data.add(episode);
        return episode;
    }

    all() {
        return AbstractRepository._data.find({ contentType: Record.CONTENT_TYPES.EPISODE })
    }
}

class MoviesRepository extends AbstractRepository {
    /**
     * @param {*} jsonObject 
     * @param {MultiEpisodesContent} parent 
     * @returns {Movie}
     */
    create(jsonObject, parent = undefined) {
        let movie = Movie.fromJson(jsonObject);
        if (parent !== undefined) {
            parent.movies.add(movie)
        }
        AbstractRepository._data.add(movie);
        return movie;
    }

    all() {
        return AbstractRepository._data.find({ contentType: Record.CONTENT_TYPES.MOVIE })
    }
}

class TvShowsRepository extends AbstractRepository {
    /**
     * @param {*} jsonObject 
     * @param {MultiEpisodesContent} parent 
     * @returns {TvShow}
     */
    create(jsonObject, parent = undefined) {
        let tvShow = TvShow.fromJson(jsonObject);
        if (parent !== undefined) {
            parent.tvShows.add(tvShow)
        }
        AbstractRepository._data.add(tvShow);
        return tvShow;
    }

    all() {
        return AbstractRepository._data.find({ contentType: Record.CONTENT_TYPES.TVSHOW })
    }
}

class SeriesRepository extends AbstractRepository {
    /**
     * @param {*} jsonObject 
     * @param {MultiEpisodesContent} parent 
     * @returns {Series}
     */
    create(jsonObject, parent = undefined) {
        let series = Series.fromJson(jsonObject);
        if (parent !== undefined) {
            parent.serieses.add(series)
        }
        AbstractRepository._data.add(series);
        return series;
    }

    /**
     * 
     * @param {string|number} id 
     * @returns {Series} 
     */
    get(id) {
        return super.get(id);
    }

    all() {
        return AbstractRepository._data.find({ contentType: Record.CONTENT_TYPES.SERIES })
    }
}

class SeasonsRepository extends AbstractRepository {
    /**
     * @param {*} jsonObject 
     * @param {MultiEpisodesContent} parent 
     * @returns {Season}
     */
    create(jsonObject, parent = undefined) {
        let season = Season.fromJson(jsonObject);
        if (parent !== undefined) {
            parent.seasons.add(season)
        }
        AbstractRepository._data.add(season);
        return season;
    }

    all() {
        return AbstractRepository._data.find({ contentType: Record.CONTENT_TYPES.SEASON })
    }
}

module.exports = { MoviesRepository, EpisodesRepository, TvShowsRepository, SeriesRepository, SeasonsRepository, AbstractRepository }