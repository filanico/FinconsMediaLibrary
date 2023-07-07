const { Movie } = require("../MediaItems");
const { AbstractRepository } = require("../Repositories");

class MoviesRepository extends AbstractRepository {
    constructor() {
        super(Movie);
    }
}

module.exports = { MoviesRepository }