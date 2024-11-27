const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/mysql");
const { Room } = require('./room');

const Beds = sequelize.define("Beds", 
    {
        bed_type: {
            type: DataTypes.ENUM('single', 'double'),
            allowNull: false,
        },
        bed_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "beds"
    }
);

Beds.belongsTo(Room);
Room.hasMany(Beds);


module.exports = { Beds };
