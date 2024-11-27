const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/mysql");
const { Booking } = require('./booking');

const Payments = sequelize.define("Payments", 
    {
        payment_date: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.fn("NOW")
        },
        amount: DataTypes.INTEGER,
        status: {
            type: DataTypes.ENUM('hotel', 'service'),
            allowNull: false,
        },
        payment_gateway: DataTypes.STRING,
    },
    {
        tableName: "payments"
    }
);

Payments.belongsTo(Booking);
Booking.hasMany(Payments);

module.exports = { Payments };
