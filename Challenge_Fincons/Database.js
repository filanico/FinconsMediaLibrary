const { Media } = require("./Media");
const { Mutex } = require('async-mutex');
const { CLASS_TYPES } = require("./utils/maps");
class Database {

    /** @type {[Media]} */
    _data = [];

    /** @type {[Mutex]} */
    #lock = null;

    /** @type {Database} */
    static _instance = null;
    static counter = 1;

    /**
     * 
     * @returns {Database}
     */
    static Get() {
        if (Database._instance === null) {
            Database._instance = new Database();
        }
        return Database._instance;
    }

    constructor() {
        if (Database._instance === null) {
            this._data = [];
            Database.counter++;
            this.#lock = new Mutex();
        }
    }

    /**
     * 
     * @param {Media} media 
     * @returns {Media}
     */
    add(media) {
        this._data.push(media)
        return media.toJson();
    }
    /**
     * 
     * @param {number} id 
     */
    remove(id) {
        this._data = this._data.filter(item => item.id != id)
    }

    /**
     * 
     * @param {number} id 
     * @returns number
     */
    indexOf(id) {
        return this._data.map(item => item.id).indexOf(parseInt(id))
    }
    /**
     * 
     * @param {number} id 
     * @returns {Media}
     */
    find(id) {
        return this._data[this.indexOf(id)];
    }
    findAllOf(Class = Media) {
        let classType = CLASS_TYPES[Class]
        return this._data.filter(media => media.type === classType);
    }
    /**
     * 
     * @param {number} index 
     * @returns {Media}
     */
    at(index) {
        return this._data[index];
    }
    /**
     * 
     * @param {number} id 
     * @param {Media} mediaItem 
     */
    setAt(index, mediaItem) {
        this._data[index] = mediaItem
    }
    /**
     * 
     * @param {number} id 
     * @param {Media} media 
     * @returns {Media}
     */
    update(id, media) {
        let indexOfId = this.indexOf(id);
        let currentItem = this.find(id);
        if (!currentItem || !media) {
            return null;
        }
        let mediaJson = media.toJson();
        Object.entries(media.toJson())
            .filter(entry => entry[1] === undefined)
            .map(entry => entry[0])
            .forEach(undefinedProperty => delete mediaJson[undefinedProperty])

        let updatedItem = Media.fromJson({ ...currentItem.toJson(), ...mediaJson, id: parseInt(media.id) })
        this.setAt(indexOfId, updatedItem)
        return updatedItem
    }

    length() {
        return this._data.length
    }

    clear() {
        this._data = [];
    }
    /**
     * @returns {Promise}
     */
    async getLock() {
        return await this.#lock.acquire();
    }
}

module.exports = { Database }