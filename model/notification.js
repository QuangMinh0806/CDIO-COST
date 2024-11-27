const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/mysql");
const { User } = require('./user');

const Notifications = sequelize.define("Notifications", 
    {
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
    },
    {
        tableName: "notifications"
    }
);

Notifications.belongsTo(User);
User.hasMany(Notifications);

module.exports = { Notifications };
