const { Sequelize } = require('sequelize');

class Database {
    static _connection = null;

    static async connect(syncModels) {
        if (Database._connection === null) {
            Database._connection = new Sequelize({
                dialect: 'sqlite',
                storage: '../../database.sqlite',
                sync: { force: true, alter: true }
            });

            await Database._connection.authenticate();

            syncModels();

            await Database._connection.sync();
        }

        return Database._connection;
    }

    static disconnect() {
        if (Database._connection === null) {
            return;
        }

        Database._connection.disconnect();

        Database._connection = null;
    }

    static get connection() {
        return Database._connection;
    }
}

module.exports = { Database };
