const {Services} = require("../model/service");
const {Sequelize, Op} = require("sequelize");
const { sequelize } = require("../config/mysql");
const { Hotel } = require("../model/hotel");
const { Booking_Services } = require("../model/booking_services");

const createServices = async (id, data) => {
    try {
        const index = await Hotel.findOne({
            attributes : ["id"],
            where : {
                UserId : id
            }
        })

        data.HotelId = index.dataValues.id;
        const check = await Services.findOne({
            where : {
                service_name : data.service_name,
                HotelId : data.HotelId
            },
            include : [
                {
                    model : Hotel,
                    where : {UserId : id},
                    attributes : []
                }
            ]
        });
    
        if(check){
            return -1;
        }
    
        await Services.create(data);
    } catch (error) {
        console.log(error);
        return "error";
    }
}


const getAllServices = async (id) => {
    try {
        const sql = `SELECT
                        s.id,
                        s.service_name,
                        s.price
                    FROM
                        services s
                    JOIN
                        hotel h ON s."HotelId" = h.id
                    WHERE
                        h."UserId" = ${id}`;
        
        const services = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });

        return services;
    } catch (error) {
        console.log(error);
        return "error";
    }
}


const bookingServices = async (data) => {
    try {
        await Booking_Services.create(data);
    } catch (error) {
        console.log(error);
        return "error";
    }
}
module.exports = {createServices, getAllServices, bookingServices}