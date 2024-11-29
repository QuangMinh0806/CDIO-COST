const { Sequelize, DataTypes, where } = require('sequelize');
const { sequelize } = require("../config/mysql");
const { User } = require('./user');

const Booking = sequelize.define("Booking",
    {
        checkin: DataTypes.DATEONLY,
        checkout: DataTypes.DATEONLY,
        adult_count: DataTypes.INTEGER,
        total_price: DataTypes.INTEGER,
        status: {
            type: DataTypes.ENUM('booked', 'cancelled', 'completed', 'pending'),
            allowNull: false,
            defaultValue : "pending"
        },
        note: DataTypes.TEXT,
    },
    {
        tableName: "booking",
        timestamps : true
    }
);

Booking.belongsTo(User);
User.hasMany(Booking);



module.exports = { Booking };
