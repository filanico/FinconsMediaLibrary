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

const TYPE_ROUTE = {
    [Media.TYPE_EPISODE]: 'episodes',
    [Media.TYPE_MOVIE]: 'movies',
    [Media.TYPE_SEASON]: 'seasons',
    [Media.TYPE_SERIES]: 'series',
    [Media.TYPE_TVSHOW]: 'tv-shows',
}

/**
 * 
 * @param {string} routeName 
 * @returns {string}
 */
function routeGroupToMediaType(routeName) {
    let [mediaType] = Object.entries(TYPE_ROUTE)
        .filter(pair => {
            let [mediaType, _routeGroupName] = pair;
            return _routeGroupName === routeName
        })
        .map(pair => {
            let [mediaType, _routeGroupName] = pair;
            return mediaType
        })
    return mediaType
}
/**
 * 
 * @param {string} routeName 
 * @returns {string}
 */
function mediaTypeToRouteGroup(mediaType) {
    return TYPE_ROUTE[mediaType];
}

module.exports = { CLASS_TYPES, TYPES_CLASS, TYPE_ROUTE, routeGroupToMediaType, mediaTypeToRouteGroup }