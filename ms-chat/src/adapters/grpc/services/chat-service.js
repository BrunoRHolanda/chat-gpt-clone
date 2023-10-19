const { ChatDbRepository } = require("../../db/repositories/chat-db-repository");
const { FindAllChatsUseCase } = require("../../../application/chat/use-cases/chat/find-all-chats-use-case");
const { CreateChatUseCase } = require("../../../application/chat/use-cases/chat/create-chat-use-case");
const { DestroyChatUseCase } = require("../../../application/chat/use-cases/chat/destroy-chat-use-case");

const chatRepository = new ChatDbRepository();

module.exports = {
    List(_, callback) {
        (new FindAllChatsUseCase(chatRepository))
            .execute()
            .then((chats) => {
            callback(null, chats.map(chat => ({id: chat.id, title: chat.title})));
            })
            .catch((error) => {
                callback(new Error(error.message), null);
            });
    },

    Create({ request: { title } }, callback) {
        (new CreateChatUseCase(chatRepository))
            .execute({ title })
            .then((newChat) => {
                callback(null, {id: newChat.id, title: newChat.title});
            })
            .catch((error) => {
                callback(new Error(error.message), null);
            });
    },

    Destroy({ request: { id } }, callback) {
        (new DestroyChatUseCase(chatRepository))
            .execute({ id })
            .then(() => {
                callback(null, {});
            })
            .catch((error) => {
                callback(new Error(error.message), null);
            });
    }
}
