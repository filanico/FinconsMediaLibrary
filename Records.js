const { Record } = require("./Record")

class Records {
    /** @type {[Record]} */
    #items = null

    /**
     * 
     * @param {[Record]} _items 
     */
    constructor(_items = []) {
        this.#items = [..._items]
    }

    /**
     * @return {[Record]}
     */
    all() {
        return this.#items
    }

    /**
     * 
     * @return {[Records]}
     * @param {number} id 
     */
    get(id) {
        let [item] = this.#items.filter(item => item.id == id)
        return item;
    }

    /**
     * 
     * @param {*} filters 
     * @returns {[Record]}
     */
    find({ title = undefined, originalTitle = undefined, productionYear = undefined, contentType = undefined }) {
        return this.#items.filter(item => {
            return (
                (contentType !== undefined && contentType === Record.CONTENT_TYPES.ALL)
                ||
                (
                    (title !== undefined && item.title === title) ||
                    (originalTitle !== undefined && item.originalTitle === originalTitle) ||
                    (productionYear !== undefined && item.productionYear === productionYear) ||
                    (contentType !== undefined && item.contentType === contentType) ||
                    false
                )
            )
        });
    }

    /**
     * 
     * @return {Records}
     * @param {Record} record 
     */
    add(record) {
        this.#items.push(record)
        return this
    }

    /**
     * 
     * @return {Records}
     */
    clear() {
        this.#items = []
        return this
    }

    /**
     * @return {Records}
     * @param {Record|number} recordOrId 
    */
    delete(recordOrId) {
        let id = recordOrId instanceof Record ? recordOrId.id : recordOrId;
        this.#items = this.#items.filter(item => item.id != id)
        return this
    }

    /**
     * 
     * @return {Records}
     * @param {[Record]} records 
    */
    batchAdd(records) {
        records.forEach(record => this.add(record))
        return this
    }

    /**
     * 
     * @return {Records}
     * @param {[Record]} records 
    */
    batchRemove(records) {
        records.forEach(record => this.remove(record))
        return this
    }

    /**
     * 
     * @param {[Record]} records 
    */
    batchUpdate() { }

    toJson() {
        return this.#items.map(item => item.toJson())
    }

    /**
     * 
     * @param {[Record]} jsonArray 
     */
    static fromJson(jsonArray) {
        return jsonArray.map(jsonItem => Record.fromJson(jsonItem))
    }



}
module.exports = { Records }