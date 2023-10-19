class FindAllChatsUseCase {
    constructor(repository) {
        this._repository = repository;
    }

    async execute() {
        return this._repository.findAll();
    }
}


module.exports = { FindAllChatsUseCase };