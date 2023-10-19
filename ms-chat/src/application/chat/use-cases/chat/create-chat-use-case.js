import {ChatEntity} from "../../entities/chat-entity";

class CreateChatUseCase {
    constructor(repository) {
        this._repository = repository;
    }

    async execute({ title }) {
        const chat = new ChatEntity(0, title);

        chat.validate();

        return this._repository.insert(chat);
    }
}

module.exports = { CreateChatUseCase };
