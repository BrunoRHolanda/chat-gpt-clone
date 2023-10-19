const {ChatRepository} = require('../../../application/chat/repositories/chat-repository');
const {Chat} = require('../models/chat');
const {ChatEntity, Model, ChatConfiguration} = require('../../../application/chat/entities/chat-entity');
const {Message} = require("../models/message");
const {MessageEntity, Role} = require("../../../application/chat/entities/message-entity");

class ChatDbRepository extends ChatRepository {

    _handleMessages(chat_id, messages) {
        const messagesEntityNew = messages.filter(message => message.deleted_at === null)
            .map(message => new MessageEntity(
                message.id,
                chat_id,
                Role.from(message.role),
                message.content,
                message.total_tokens,
                message.deleted_at
            ));

        const deletedMessages = messages.filter(message => message.deleted_at !== null)
            .map(message => new MessageEntity(
                message.id,
                chat_id,
                Role.from(message.role),
                message.content,
                message.total_tokens,
                message.deleted_at
            ));

        return [ messagesEntityNew, deletedMessages ];
    }
    async _saveMessages(chat_id, messagesEntity) {
        if (await Message.count({ where: { chat_id: chat_id } }) > 0) {
            await Message.destroy({ where: { chat_id: chat_id } });
        }

        const messages = await Promise.all(messagesEntity.map(message => Message.create({
            chat_id: chat_id,
            role: message.role.name,
            content: message.content,
            total_tokens: message.total_tokens,
            deleted_at: message.deleted_at,
        })));

        return this._handleMessages(chat_id, messages);
    }

    async _findMessages(chat_id) {
        const messages = await Message.findAll({ where: { chat_id: chat_id } });

        return this._handleMessages(chat_id, messages);
    }
    async save(chatEntity) {
        if (!(chatEntity instanceof ChatEntity)) {
            console.log(chatEntity);

            throw new Error("Invalid chat entity");
        }

        let chat = await Chat.findOne({ where: { id: chatEntity.id } });

        if (chat !== null) {
            await Chat.update({
                title: chatEntity.title,
                temperature: chatEntity.configuration.temperature,
                topP: chatEntity.configuration.topP,
                n: chatEntity.configuration.n,
                stop: chatEntity.configuration.stop,
                max_tokens: chatEntity.configuration.max_tokens,
                model: chatEntity.model.name,
                model_max_token: chatEntity.model.max_tokens,
                total_token_usage: chatEntity.token_usage,
            }, { where: { id: chatEntity.id } });

            chat = await Chat.findOne({ where: { id: chatEntity.id } })
        } else {
            chat = await Chat.create({
                title: chatEntity.title,
                temperature: chatEntity.configuration.temperature,
                topP: chatEntity.configuration.topP,
                n: chatEntity.configuration.n,
                stop: chatEntity.configuration.stop,
                max_tokens: chatEntity.configuration.max_tokens,
                model: chatEntity.model.name,
                model_max_token: chatEntity.model.max_tokens,
                total_token_usage: chatEntity.token_usage,
            });
        }

        const [ messages, deletedMessages ] = await this._saveMessages(chat.id, chatEntity.all_messages);

        return new ChatEntity(
            chat.id,
            Model.from(chat.model, chat.model_max_token),
            chat.title,
            new ChatConfiguration(
                chat.temperature,
                chat.topP,
                chat.n,
                chat.stop,
                chat.max_tokens
            ),
            messages,
            deletedMessages,
            chat.total_token_usage,
        );
    }

    async findById(id) {
        const chat = await Chat.findOne({ where: { id: id } });
        const [ messages, deletedMessages ] = await this._findMessages(id);

        if (chat === null) {
            return null;
        }

        return new ChatEntity(
            chat.id,
            Model.from(chat.model, chat.model_max_token),
            chat.title,
            new ChatConfiguration(
                chat.temperature,
                chat.topP,
                chat.n,
                chat.stop,
                chat.max_tokens
            ),
            messages,
            deletedMessages,
            chat.total_token_usage,
        );
    }
}

module.exports = { ChatDbRepository };
