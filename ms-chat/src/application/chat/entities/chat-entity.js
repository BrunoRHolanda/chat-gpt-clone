const { Entity } = require('../@shared/Entity');
const {validation} = require("../@shared/validation-rules");
const {MessageEntity, Role} = require("./message-entity");

class Model {
    static GPT3 = 'gpt-3.5-turbo';
    static GPT4 = 'gpt-4';

    constructor(name, max_tokens) {
        this._name = name;
        this._max_tokens = max_tokens;
    }

    get name() {
        return this._name;
    }

    get max_tokens() {
        return this._max_tokens;
    }

    static from(name, maxTokens) {
        if (Model.isGPT3(name) || Model.isGPT4(name)) {
            return new Model(name, maxTokens);
        }

        throw new Error(`Model ${name} is not supported.`);
    }

    static isGPT3(name) {
        return name === Model.GPT3;
    }

    static isGPT4(name) {
        return name === Model.GPT4;
    }
}

class ChatConfiguration {
    constructor(temperature, topP, n, stop, maxTokens) {
        this._temperature = temperature;
        this._topP = topP;
        this._n = n;
        this._stop = stop;
        this._maxTokens = maxTokens;
    }

    get temperature() {
        return this._temperature;
    }

    get topP() {
        return this._topP;
    }

    get n() {
        return this._n;
    }

    get stop() {
        return this._stop;
    }

    get maxTokens() {
        return this._maxTokens;
    }
}

class ChatEntity extends Entity {
    constructor(id, model, title, configuration, messages, deleted_messages, token_usage) {
        super(id);

        this._model = model;
        this._title = title;
        this._configuration = configuration;
        this._messages = messages;
        this._deleted_messages = deleted_messages;
        this._token_usage = token_usage || 0;
    }

    validate() {
        super.validate();

        validation
            .createStringValidator('title', this._title)
            .isString()
            .isRequired()
            .max(255);

        validation
            .createNumberValidator('configuration.temperature', this._configuration?.temperature)
            .isNumber()
            .isFloat()
            .lte(0)
            .gte(1);

        validation
            .createNumberValidator('configuration.topP', this._configuration?.topP)
            .isNumber()
            .isFloat()
            .lte(0)
            .gte(1);

        validation
            .createNumberValidator('configuration.n', this._configuration?.n)
            .isNumber()
            .isUnsigned();

        this._configuration?.stop.forEach((stop, index) => {
            validation
                .createStringValidator(`configuration.stop[${index}]`, stop)
                .isString()
                .isRequired()
                .max(255);
        });

        validation
            .createNumberValidator('configuration.maxTokens', this._configuration?.maxTokens)
            .isNumber()
            .isUnsigned();

        if (this._messages) {
            validation.createArrayValidator('messages', this._messages).isArray();
            this._messages.forEach((message) => {
                if (message instanceof MessageEntity) {
                    return;
                }

                throw new Error('messages must be an array of Message objects.');
            });
        }

        if (!this._model) {
            throw new Error('model is required.');
        }

        if (!(this._model instanceof Model)) {
            throw new Error('model must be an instance of Model.');
        }
    }
    get model() {
        return this._model;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get configuration() {
        return this._configuration;
    }

    get messages() {
        return this._messages;
    }

    get deleted_messages() {
        return this._deleted_messages;
    }

    get all_messages() {
        return this._deleted_messages.concat(this._messages);
    }

    get token_usage() {
        return this._token_usage;
    }

    __removeOldMessagesUntilNewOneFits(chat_new_total_tokens) {
        if (this._deleted_messages === undefined) {
            this._deleted_messages = [];
        }

        do {
            const message = this._messages.shift();

            message.delete();

            this._deleted_messages.push(message);
        } while (this._token_usage > chat_new_total_tokens);
    }

    _refreshTokenUsage(chat_new_total_tokens) {
        this._token_usage += chat_new_total_tokens;
    }

    async addMessage(role, content) {
        const { getEncoding } = require('js-tiktoken');
        const map = {
            [Model.GPT3]: 'gpt-3',
            [Model.GPT4]: 'gpt-4',
        };

        const message_total_tokens = getEncoding(map[this._model.name]).encode(content).length;
        const chat_new_total_tokens = this._token_usage + message_total_tokens;

        if (this._messages === undefined) {
            this._messages = [];
        }

        if (chat_new_total_tokens > this._model.max_tokens) {
            this.__removeOldMessagesUntilNewOneFits();
        }

        this._messages.push(new MessageEntity(0, this._id, role, content, message_total_tokens));
        this._refreshTokenUsage(chat_new_total_tokens);
    }

    async static newChat(title, initialMessage, model, configuration, saveChat) {
        const chat =  new ChatEntity(0, model, title, configuration);

        await chat.addMessage(Role.SYSTEM, initialMessage);

        return chat;
    }
}

module.exports = { ChatEntity, ChatConfiguration, Model };
