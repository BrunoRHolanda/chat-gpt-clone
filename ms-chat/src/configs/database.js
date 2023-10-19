const { Sequelize } = require('sequelize');

class Database {
    static _connection = null;

    static async connect() {
        if (Database._connection === null) {
            Database._connection = new Sequelize({
                dialect: 'sqlite',
                storage: '../../database.sqlite'
            });

            await Database._connection.authenticate();
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
