const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/mysql");
const { Room } = require('./room');

const Pricing = sequelize.define("Pricing", 
    {
        name: DataTypes.STRING,
        start_date: DataTypes.DATEONLY,
        end_date: DataTypes.DATEONLY,
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "pricing"
    }
);

Pricing.belongsTo(Room);
Room.hasMany(Pricing);

module.exports = { Pricing };
