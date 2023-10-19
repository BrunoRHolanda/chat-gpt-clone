const { Model, DataTypes, Deferrable} = require('sequelize');

const { Database } = require('../../../configs/database');
const {Chat} = require('./chat');

class Message extends Model {}

Message.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    chat_id: {
        type: DataTypes.INTEGER,
        model: Chat,
        key: 'id',
        deferrable: Deferrable.INITIALLY_IMMEDIATE
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total_tokens: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    deleted_at: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
    }
}, {
    sequelize: Database.connection,
    tableName: 'messages'
});

module.exports = { Message };