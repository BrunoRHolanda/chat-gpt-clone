const events = require('events');
const { ChatDbRepository } = require("../../db/repositories/chat-db-repository");
const {Completion} = require("../../../application/chat/use-cases/completion");
const {Model} = require("../../../application/chat/entities/chat-entity");

module.exports = {
    ChatStream(call) {
        const { chatId, userMessage } = call.request;
        const chatRepository = new ChatDbRepository();
        const eventEmitter = new events.EventEmitter();
        const completion = new Completion(chatRepository, eventEmitter);

        eventEmitter.on('completion_stream', (content) => {
            call.write({ chatId, content });
        });

        eventEmitter.on('completion_stream_end', () => {
            call.end();
        });

        completion.execute(chatId || 0, userMessage, {
            model: Model.GPT3,
            model_max_token: 4096,
            temperature: 0.9,
            topP: 1,
            n: 1,
            stop: '\\super-end\\',
            max_tokens: 300,
            initialMessage: 'Seu nome é Huia. Você é a inteligência artificial da Gauge. Você da suporte a programadores e arquitetos de software. ',
            title: 'Novo Chat HUIA'
        });
    }
}
