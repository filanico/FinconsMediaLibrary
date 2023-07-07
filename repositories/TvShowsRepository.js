const { TvShow } = require("../MediaItems");
const { AbstractRepository } = require("../Repositories");

class TvShowsRepository extends AbstractRepository {
    constructor() {
        super(TvShow);
    }
}

module.exports = { TvShowsRepository }