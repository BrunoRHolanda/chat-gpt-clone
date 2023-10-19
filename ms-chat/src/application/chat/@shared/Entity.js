const {validation} = require("./validation-rules");

class Entity {
    constructor(id) {
        this._id = id;
    }

    validate() {
        validation
            .createNumberValidator('id', this._id)
            .isNumber()
            .isInteger()
            .isUnsigned()
    }

    get id() {
        return this._id;
    }
}

module.exports = { Entity };
