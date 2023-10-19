import {ChatRepository} from "../../../application/chat/repositories/chat-repository";
import {Chat} from "../models/chat";
import {ChatEntity} from "../../../application/chat/entities/chat-entity";

class ChatDbRepository extends ChatRepository {
    async insert(chatEntity) {
        const chat = await Chat.create({ title:  chatEntity.title });

        return new ChatEntity(chat.id, chat.title);
    }

    async findAll() {
        const chats = await Chat.findAll();

        return chats.map(chat => {
            return new ChatEntity(chat.id, chat.title);
        });
    }

    async destroy(id) {
        await Chat.destroy({ where: id })
    }
}

module.exports = { ChatDbRepository };
