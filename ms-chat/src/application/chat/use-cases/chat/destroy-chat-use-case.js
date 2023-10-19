class DestroyChatUseCase {
    constructor(repository) {
        this._repository = repository;
    }

    async execute({ id }) {
        await this._repository.destroy(id);
    }
}

module.exports = { DestroyChatUseCase };
