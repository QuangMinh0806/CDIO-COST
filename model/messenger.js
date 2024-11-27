const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/mysql");
const { User } = require('./user');

const Messenger = sequelize.define("Messenger", 
    {
        messageContent: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        messageTime: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.fn("NOW")
        },
    },
    {
        tableName: "messenger"
    }
);

User.hasMany(Messenger, {foreignKey : "senderId"});
User.hasMany(Messenger, {foreignKey : "receiverId"});

Messenger.belongsTo(User, { foreignKey: "senderId", as: 'sender' });
Messenger.belongsTo(User, { foreignKey: "receiverId", as: 'receiver' });


module.exports = { Messenger };
