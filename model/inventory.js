const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/mysql");
const { RoomDetails } = require('./room_detail');


const Inventory = sequelize.define("Inventory", 
    {
        status: {
            type: DataTypes.ENUM('Occupied', 'Reserved', 'On-change', "Empty"),
            allowNull: false,
            defaultValue : "Reserved"
        },
        inventory_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    },
    {
        tableName: "inventory"
    }
);

Inventory.belongsTo(RoomDetails);
RoomDetails.hasMany(Inventory);


module.exports = { Inventory };
