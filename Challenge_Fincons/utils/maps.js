const { Episode, Media, Movie, Season, Series, TvShow } = require("../Media");

const CLASS_TYPES = {
    [Episode]: Media.TYPE_EPISODE,
    [Movie]: Media.TYPE_MOVIE,
    [Season]: Media.TYPE_SEASON,
    [Series]: Media.TYPE_SERIES,
    [TvShow]: Media.TYPE_TVSHOW,
}

const TYPES_CLASS = {
    [Media.TYPE_EPISODE]: Episode,
    [Media.TYPE_MOVIE]: Movie,
    [Media.TYPE_SEASON]: Season,
    [Media.TYPE_SERIES]: Series,
    [Media.TYPE_TVSHOW]: TvShow,
}

module.exports = { CLASS_TYPES, TYPES_CLASS }