const { Model, DataTypes} = require("sequelize");

const { Database } = require('../../../configs/database');

class Chat extends Model {}

Chat.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    temperature: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    topP: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    n: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    stop: {
        type: DataTypes.STRING,
        allowNull: true
    },
    maxTokens: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total_token_usage: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    }
}, {
    sequelize: Database.connection,
    tableName: 'chats'
});

module.exports = { Chat };
