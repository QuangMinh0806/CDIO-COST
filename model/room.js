const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/mysql");
const { Hotel } = require('./hotel');

const Room = sequelize.define("Room",
    {
        name: DataTypes.STRING,
        adult_count: DataTypes.INTEGER,
        room_type: {
            type: DataTypes.ENUM('hotel', 'apartment'),
            allowNull: false,
        },
        square_meters: DataTypes.INTEGER,
        price_per_night: DataTypes.INTEGER,
        bedroom_count: DataTypes.INTEGER,
        living_room_count: DataTypes.INTEGER,
        kitchen_count: DataTypes.INTEGER,
        bathroom_count: DataTypes.INTEGER,
    },
    {
        tableName: 'room',
        timestamps : true
    }
);

Room.belongsTo(Hotel);
Hotel.hasMany(Room);

module.exports = { Room };
