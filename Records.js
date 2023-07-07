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

    first() {
        return this.#items.length > 0 ? this.#items[0] : null
    }

    indexOf(record) {
        let ids = this.#items.map(_record => _record.id)
        return ids.indexOf(record.id);
    }

    updateAt(index, _updatedItem) {
        try {
            let currentItem = this.get(_updatedItem.id)
            let updatedItem = currentItem.constructor.fromJson(_updatedItem);
            this.#items[index] = currentItem.constructor.fromJson({ ...currentItem.toJson(), ...updatedItem.toJson() })
            return this.#items[index]
        } catch (error) {

        }
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
     * @param {[Record]} record 
     */
    add(record) {
        return this.addMany([record])
    }

    addMany(recordArray) {
        recordArray.forEach(record => this.#items.push(record))
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
        let oldLen = this.#items.length
        this.#items = this.#items.filter(item => item.id != id)
        return oldLen > this.#items.length
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
    static fromJson(jsonObject) {
        return this.fromJsonArray([jsonObject])
    }

    static fromJsonArray(jsonArray) {
        return jsonArray.map(jsonItem => Record.fromJson(jsonItem))
    }



}
module.exports = { Records }