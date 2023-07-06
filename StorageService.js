const fs = require('fs')

class StorageService {
    static DEFAULT_DATABASE_PATH = 'catalog.json'

    /** @type {string} */
    #dbFilePath = StorageService.DEFAULT_DATABASE_PATH

    /**
     * 
     * @param {string} _filepath 
     */
    constructor(_filepath) {
        this.#dbFilePath = _filepath || DEFAULT_FILEPATH;
        if (fs.existsSync(this.#dbFilePath)) {
            console.log("Reading existing database at " + this.#dbFilePath)
            // this.read();
        } else {
            this.createNew();
        }
    }

    createNew() {
        Repository._("Creating new database at " + this.#dbFilePath)
        fs.writeFileSync(this.#dbFilePath, JSON.stringify(this._getCatalogObject()));
    }
}

module.exports = { StorageService }