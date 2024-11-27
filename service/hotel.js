const {Hotel} = require("../model/hotel");
const {Sequelize, Op} = require("sequelize");
const { sequelize } = require("../config/mysql");

const createHotel = async (data) => {
    try {
        const check = await Hotel.findOne({
            where : {
                name : data.name
            }
        });
    
        if(check){
            return -1;
        }
    
        await Hotel.create(data);
    } catch (error) {
        console.log(error);
        return "error";
    }
}


const getHotel = async (id) => {
    try {
        const sql = `SELECT 
                        h.id,
                        h.name,
                        h.image,
                        h.description,
                        CONCAT(h.address, ', ', h.city, ', ', h.country) as address,
                        h.amenity_type
                    FROM Hotel h
                    WHERE h.id = ${id}`
        const hotel = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });

        return hotel;
    } catch (error) {
        console.log(error);
        return "error";
    }
}

module.exports = {createHotel, getHotel}