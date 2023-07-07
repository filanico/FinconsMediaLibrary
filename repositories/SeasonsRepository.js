const { Season, MultiSeasonsContent } = require("../MediaItems");
const { AbstractRepository } = require("../Repositories");

class SeasonsRepository extends AbstractRepository {
    constructor() {
        super(Season);
    }

    delete(id) {
        /** @type {Season} */
        let season = this.get(id);
        /** @type {MultiSeasonsContent} */
        let parent = this.get(season.parent);
        if (!AbstractRepository.empty(parent)) {
            parent.seasons.delete(season);
        }
        super.delete(id)
    }
}

module.exports = { SeasonsRepository }