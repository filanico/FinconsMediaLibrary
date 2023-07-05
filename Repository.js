const fs = require('fs');
const { Series, MultiSeasonsContent, Season, TvShow, Movie } = require('./MediaItems');
const { clear } = require('console');

// class RepositoryCollection {
//     #mediaItems = [
//         (new Series()).setTitle("SWAT")
//     ]

//     constructor(Type) {
//         console.log(Type);
//     }
//     /**
//      * 
//      * @param {string} title 
//      */
//     findByTitle(title) {
//         let mediaItemFound = this.#mediaItems.filter(mediaItem => mediaItem.title === title);
//         // Repository._("list of found medias with title=" + title)
//         console.log("findByTitle", mediaItemFound);
//     }

//     create() {

//     }

//     delete() {

//     }

//     update(newConfig) {

//     }

//     all() {

//     }

//     getJsonContent() {
//         return {
//             mediaItems: this.#mediaItems
//         }
//     }
// }

class Repository {
    _series = []
    _tvShows = []
    _movies = []

    #dbFilepath = undefined

    static _(s) {
        console.log("[Repository] " + s);
    }

    constructor(_filepath = undefined) {
        this.#dbFilepath = _filepath || DEFAULT_FILEPATH;
        if (fs.existsSync(this.#dbFilepath)) {
            Repository._("Reading existing database at " + this.#dbFilepath)
            this.read();
        } else {
            this.createNew();
        }
    }

    get series() {
        return this._series;
    }

    get tvShows() {
        return this._tvShows;
    }

    get movies() {
        return this._movies;
    }

    _getCatalogObject() {
        return {
            series: this._series,
            tvShows: this._tvShows,
            movies: this._movies,
        }
    }

    createNew() {
        Repository._("Creating new database at " + this.#dbFilepath)
        fs.writeFileSync(this.#dbFilepath, JSON.stringify(this._getCatalogObject()));
    }

    read() {
        let json = '';
        const fileContent = fs.readFileSync(this.#dbFilepath);
        try {
            json = JSON.parse(fileContent);
            this._series = json.series
            this._movies = json.movies
            this._tvShows = json.tvShows
        } catch (error) {
            // console.log(json, fileContent)
        }
    }

    persist() {
        fs.writeFileSync(this.#dbFilepath, JSON.stringify({
            series: this._series,
            tvShows: this._tvShows,
            movies: this._movies,
        }));
    }

    createSeries({ title = '', originalTitle = '', productionYear = 0 }) {
        const s = (new Series())
            .setTitle(title)
            .setOriginalTitle(originalTitle)
            .setProductionYear(productionYear)
        this.series.push(
            s.toJson()
        );
    }

    _findSeries(ids) {
        return this._series.filter(s => ids.includes(s.id))
    }
    /**
     * 
     * @param {*} param0 
     * @returns {[Series]}
     */
    getSeries(ids = undefined) {
        let _series = []
        if (ids == undefined) {
            _series = this._series;
        } else {
            _series = this._findSeries(ids)
        }
        return _series.map(json => Series.fromJson(json))
    }

    deleteSeries(ids) {
        const clearedSeries = this
            ._findSeries(ids)
            .filter(series => !this._series.includes(series))
        this._series = [...clearedSeries]
    }

    /**
     * 
     * @param {MultiSeasonsContent} parentMediaItem 
     */
    createSeason(parentMediaItem, { title = '', originalTitle = '', productionYear = 0 }) {
        if (parentMediaItem instanceof MultiSeasonsContent) {
            const season = new Season();
            season.setOriginalTitle(originalTitle).setTitle(title).setProductionYear(productionYear)
            parentMediaItem.addSeason(season);
            return season;
        } else {
            throw new Error("Unexpected media type: " + typeof (parentMediaItem))
        }
    }




    allByContentType() {

    }
}

module.exports = { Repository }