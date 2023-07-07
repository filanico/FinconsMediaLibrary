const { Episode, MultiEpisodesContent } = require("../MediaItems");
const { AbstractRepository } = require("../Repositories");

class EpisodesRepository extends AbstractRepository {
    constructor() {
        super(Episode);
    }

    delete(id) {
        // /** @type {Episode} */
        let episode = this.get(id);
        // /** @type {MultiEpisodesContent} */
        let parent = this.get(episode.parent);
        if (!AbstractRepository.empty(parent)) {
            parent.episodes.delete(episode);
        }
        super.delete(id)
    }
}

module.exports = { EpisodesRepository }