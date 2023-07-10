const { json } = require("express");

class Media {
    static ID = 1;

    id = -1
    type = "";
    title = "";
    originalTitle = "";
    productionYear = -1;

    /** @type Media */
    parent = null

    /** @type [Media] */
    children = null

    constructor({ title = "Not specified", originalTitle = "Not specified", type = undefined, productionYear = 0, parent = null, children = [] }) {
        this.id = Media.ID++
        this.title = title;
        this.originalTitle = originalTitle;
        this.type = type;
        this.productionYear = productionYear;
    }

    toJson() {
        return {
            id: this.id,
            title: this.title,
            originalTitle: this.originalTitle,
            type: this.type,
            productionYear: this.productionYear,
            parent: this.parent.toJson(),
            children: this.children.map(item => item.toJson())
        }
    }

    static fromJson(jsonObject) {
        return new Media(jsonObject)
    }
}


module.exports = { Media }