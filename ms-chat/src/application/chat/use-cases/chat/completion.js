const { openaiClient } = require("../../../../../configs/openai");

const {ChatEntity, Model, ChatConfiguration} = require("../../../entities/chat-entity");
const {Role} = require("../../../entities/message-entity");

class configDTO {
    constructor(
        model,
        model_max_token,
        temperature,
        topP,
        n,
        stop,
        max_tokens,
        initialMessage,
        title,
    ) {
        this.model = model;
        this.model_max_token = model_max_token;
        this.temperature = temperature;
        this.topP = topP;
        this.n = n;
        this.stop = stop;
        this.max_tokens = max_tokens;
        this.initialMessage = initialMessage;
        this.title = title;
    }
}

class Completion {
    constructor(chatRepository, eventEmitter) {
        this._chatRepository = chatRepository;
        this._eventEmitter = eventEmitter;
    }

    async execute(chat_id, user_message, config) {
        let chat = await this._chatRepository.findById(chat_id);

        if (!chat) {
            chat = await ChatEntity.newChat(
                config.title,
                config.initialMessage,
                Model.from(config.model, config.model_max_token),
                new ChatConfiguration(
                    config.temperature,
                    config.topP,
                    config.n,
                    config.stop,
                    config.max_tokens
                )
            );

            await this._chatRepository.insert(chat);
        }

        await chat.addMessage(Role.USER, user_message);

        const stream = await openaiClient.chat.completions.create({
            messages: chat.messages.map(message => ({
                role: message.role,
                content: message.content,
            })),
            model: chat.model.name,
            stream: true,
        });

        for await (const part of stream) {
            this._eventEmitter.emit('completion_stream', part.choices[0]?.delta?.content || '')
        }
    }
}

module.exports = { Completion, configDTO };