const { Series, MultiEpisodesContent } = require("../MediaItems");
const { Record } = require("../Record");
const { AbstractRepository } = require("../Repositories");

class SeriesRepository extends AbstractRepository {
    constructor() {
        super(Series);
    }
}

module.exports = { SeriesRepository }