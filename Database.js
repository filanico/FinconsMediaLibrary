const { Media } = require("./Media");

class Database {

    /** @type [Media] */
    static _data = [];

    /**
     * 
     * @param {Media} media 
     */
    add(media) {
        _data.push(media)
    }
    /**
     * 
     * @param {number} id 
     */
    remove(id) {
        Database._data = Database._data.filter(item => item.id != id)
    }
    /**
     * 
     * @param {number} id 
     * @returns number
     */
    indexOf(id) {
        return Database._data.map(item => item.id).indexOf(id)
    }
    /**
     * 
     * @param {number} id 
     * @returns {Media}
     */
    get(id) {
        return Database._data[this.indexOf(id)];
    }
    /**
     * 
     * @param {number} id 
     * @param {Media} mediaItem 
     */
    setAt(index, mediaItem) {
        Database._data[index] = mediaItem
    }
    /**
     * 
     * @param {number} id 
     * @param {Media} media 
     * @returns {Media}
     */
    update(id, media) {
        let indexOfId = this.indexOf(id);
        let currentItem = this.get(id);
        let updatedItem = Media.fromJson({ ...currentItem.toJson(), ...media.toJson() })
        this.setAt(indexOfId, currentItem)
        return updatedItem
    }
}