const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/mysql");
const { Services } = require('./service');
const { Booking_Detail } = require('./booking_detail');

const Booking_Services = sequelize.define("Booking_Services", 
    {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: DataTypes.INTEGER,
        total_price: DataTypes.INTEGER,
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.fn("NOW")
        }
    },
    {
        tableName: "booking_services"
    }
);

Booking_Services.belongsTo(Booking_Detail);
Booking_Detail.hasMany(Booking_Services);

Booking_Services.belongsTo(Services);
Services.hasMany(Booking_Services);

module.exports = { Booking_Services };
