const {Entity} = require("../@shared/Entity");
const {validation} = require("../@shared/validation-rules");

class Role {
    static USER = 'user';
    static SYSTEM = 'system';
    static ASSISTANT = 'assistant';
    static FUNCTION = 'function';

    constructor(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    static from(name) {
        if (Role.isUser(name) || Role.isSystem(name) || Role.isAssistant(name) || Role.isFunction(name)) {
            return new Role(name);
        }

        throw new Error(`Role ${name} is not supported.`);
    }

    static isUser(name) {
        return name === Role.USER;
    }

    static isSystem(name) {
        return name === Role.SYSTEM;
    }

    static isAssistant(name) {
        return name === Role.ASSISTANT;
    }

    static isFunction(name) {
        return name === Role.FUNCTION;
    }
}
class MessageEntity extends Entity {
    constructor(id, chat_id, role, content, total_tokens, deleted_at = null) {
        super(id);

        this._chat_id = chat_id;
        this._role = role;
        this._content = content;
        this._total_tokens = total_tokens;
        this._deleted_at = deleted_at;

        this.validate();
    }

    validate() {
        super.validate();

        validation.createNumberValidator('chat_id', this._chat_id).isInteger().isUnsigned();
        validation.createStringValidator('role', this._role.name).isString().isRequired().max(255);
        validation.createStringValidator('content', this._content).isString().isRequired().max(255);
        validation.createNumberValidator('total_tokens', this._total_tokens).isInteger().isUnsigned();

        if (!this._role) {
            throw new Error(`Role is required.`);
        }

        if (!(this._role instanceof Role)) {
            throw new Error(`Role must be an instance of Role.`);
        }
    }

    get chat_id() {
        return this._chat_id;
    }

    get role() {
        return this._role;
    }

    get content() {
        return this._content;
    }

    get total_tokens() {
        return this._total_tokens;
    }

    get deleted_at() {
        return this._deleted_at;
    }

    delete() {
        this._deleted_at = Date.now();
    }
}

module.exports = { MessageEntity, Role };
