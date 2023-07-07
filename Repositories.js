const { Episode, MultiEpisodesContent } = require('./MediaItems');
const { Record } = require('./Record');
const { Records } = require('./Records');

class AbstractRepository {

    /** @type {Records} */
    static _data = null

    /** @type {Record} */
    itemClass = null

    constructor(itemClass) {
        this.itemClass = itemClass
        AbstractRepository._data = new Records()
    }

    all() {
        return AbstractRepository._data.find({ contentType: this.itemClass.DEFAULT_CONTENT_TYPE })
    }

    static empty(obj) {
        return obj === null || obj === undefined
    }

    /**
     * 
     * @param {Record|number} id 
     * @returns 
     */
    get(recordOrId) {
        let id = recordOrId instanceof Record ? recordOrId.id : recordOrId;
        return AbstractRepository._data.get(id)
    }

    delete(id) {
        return AbstractRepository._data.delete(id)
    }
    /**
     * 
     * @param {number} id 
     * @param {*} jsonObject 
     * @returns {Record}
     */
    update(jsonObject) {
        return updateMany([jsonObject])
    }

    updateMany(jsonArray) {
        let updatedtems = []
        jsonArray.forEach(jsonObject => {
            updatedtems.push(
                AbstractRepository._data.updateAt(
                    this.indexOf(jsonObject),
                    jsonObject
                )
            );
        });
        return updatedtems;
    }

    indexOf(record) {
        return AbstractRepository._data.indexOf(record)
    }
    /**
     * 
     * @returns {AbstractRepository}
     */
    clear() {
        AbstractRepository._data = []
        return this
    }

    /**
     * 
     */
    toJson() {
        return AbstractRepository._data.toJson()
    }

    /**
     * @param {*} jsonObject 
     * @param {MultiEpisodesContent} parent 
     * @returns {Episode}
     */
    create(jsonObject) {
        return this.createMany([jsonObject]).first()
    }

    createMany(jsonArray) {
        return new Records(jsonArray.map(jsonObject => {
            let mediaItem = this.itemClass.fromJson(jsonObject);
            AbstractRepository._data.add(mediaItem);
            return mediaItem;
        }))

    }
}

module.exports = { AbstractRepository }