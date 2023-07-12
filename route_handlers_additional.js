// const { Media } = require("./Media");
// const { TYPES_CLASS } = require("./utils/maps");

// let additionalRoutesGroupsHandlers = {};

// let arr = [];

// arr = [Media.TYPE_SERIES, Media.TYPE_TVSHOW]
// arr.forEach(mediaType => {
//     additionalRoutesGroupsHandlers[mediaType] = [
//         (router) => {
//             let mediaTypeClass = TYPES_CLASS[mediaType]
//             router.post("/:id/seasons", appendSeasons(mediaTypeClass))
//             router.delete("/:id/seasons", detachSeasons(mediaTypeClass))
//             router.patch("/:id/seasons", updateSeasons(mediaTypeClass))
//         }
//     ]
// })

// arr = [Media.TYPE_SEASON, Media.TYPE_MOVIE];
// arr.forEach(mediaType => {
//     additionalRoutesGroupsHandlers[mediaType] = [
//         (router) => {
//             let mediaTypeClass = TYPES_CLASS[mediaType]
//             router.post("/:id/episodes", appendEpisodes(mediaTypeClass))
//             router.delete("/:id/episodes", detachEpisodes(mediaTypeClass))
//             router.patch("/:id/episodes", updateEpisodes(mediaTypeClass))
//         }
//     ]
// })

// module.exports = { additionalRoutesGroupsHandlers }