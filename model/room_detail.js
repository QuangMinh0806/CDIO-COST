const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/mysql");
const { Room } = require('./room');

const RoomDetails = sequelize.define("RoomDetails",
    {
        room_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: DataTypes.TEXT,
    },
    {
        tableName: "roomdetails",
        timestamps : true
    }
);

RoomDetails.belongsTo(Room);
Room.hasMany(RoomDetails);

module.exports = { RoomDetails };
