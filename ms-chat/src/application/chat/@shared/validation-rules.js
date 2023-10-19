
class Validation {
    constructor(attributeName, value) {
        this._attributeName = attributeName;
        this._value = value;
    }
}
class StringValidation extends Validation {
    constructor(attributeName, value) {
        super(attributeName, value);
    }

    isString() {
        if (typeof this._value !== 'string') {
            throw new Error(`${this._attributeName} must be a string.`);
        }

        return this;
    }

    isRequired() {
        if (this._value === '') {
            throw new Error(`${this._attributeName} is required.`);
        }

        return this;
    }

    max(length = 255) {
        if (this._value.length > length) {
            throw new Error(`${this._value} must be less than ${length} characters.`);
        }

        return this;
    }
}

class NumberValidation extends Validation {
    constructor(attributeName, value) {
        super(attributeName, value);
    }

    isNumber() {
        if (typeof this._value !== 'number') {
            throw new Error(`${this._attributeName} must be a number.`);
        }

        return this;
    }

    isInteger() {
        if (this._value % 1 !== 0) {
            throw new Error(`${this._attributeName} must be a integer value.`);
        }

        return this;
    }

    isFloat() {
        if (this._value % 1 === 0) {
            throw new Error(`${this._attributeName} must be a float value.`);
        }

        return this;
    }

    gte(value) {
        if (this._value < value) {
            throw new Error(`${this._attributeName} must be greater than or equal to ${value}.`);
        }

        return this;
    }

    isUnsigned() {
        return this.gte(0);
    }

    lte(value) {
        if (this._value >= value) {
            throw new Error(`${this._attributeName} must be less than or equal to ${value}.`);
        }

        return this;
    }
}

class ArrayValidation extends Validation {
    constructor(attributeName, value) {
        super(attributeName, value);
    }

    isArray() {
        if (!Array.isArray(this._value)) {
            throw new Error(`${this._attributeName} must be an array.`);
        }

        return this;
    }

    isRequired() {
        if (this._value.length === 0) {
            throw new Error(`${this._attributeName} is required.`);
        }

        return this;
    }
}

module.exports = {
    validation: {
        createStringValidator(attributeName, value) {
            return new StringValidation(attributeName, value);
        },

        createNumberValidator(attributeName, value) {
            return new NumberValidation(attributeName, value);
        },

        createArrayValidator(attributeName, value) {
            return new ArrayValidation(attributeName, value);
        }
    }
};
