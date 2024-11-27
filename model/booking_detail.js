const { Sequelize, DataTypes, where } = require('sequelize');
const { sequelize } = require("../config/mysql");
const { RoomDetails } = require('./room_detail');
const { Booking } = require('./booking');
const { Inventory } = require('./inventory');

const Booking_Detail = sequelize.define("Booking_Detail",
    {
        price: DataTypes.INTEGER
    },
    {
        tableName: "booking_detail"
    }
);


Booking.hasMany(Booking_Detail);
Booking_Detail.belongsTo(Booking);

RoomDetails.hasMany(Booking_Detail);
Booking_Detail.belongsTo(RoomDetails);


Booking_Detail.afterBulkCreate(async (data) => {

    const id = await Booking.findOne({
        where : {
            id : data[0].dataValues.BookingId
        },
        attributes : ["checkin", "checkout"]
    })

    const sum = (new Date(id.dataValues.checkout) - new Date(id.dataValues.checkin)) /(1000 * 3600 * 24);
    const checkinDate = new Date(id.dataValues.checkin);


    for(const booking of data){
        for(let i = 0; i<sum; i++){
            const day = new Date(checkinDate);
            day.setDate(checkinDate.getDate() + i);
            await Inventory.create({
                inventory_date : day,
                RoomDetailId : booking.dataValues.RoomDetailId
            })
        }
    }

    
});

module.exports = { Booking_Detail };