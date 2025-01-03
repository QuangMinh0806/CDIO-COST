const {Hotel} = require("../model/hotel");
const {Sequelize, Op} = require("sequelize");
const { sequelize } = require("../config/mysql");
const { find_room_hotel} = require("../helper/find_room_search");
const { User } = require("../model/user");

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
        await User.update(
            {
                role : "admin"
            },
            {
                where : {
                    id : data.UserId
                }
            }
        )
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



const findHotel = async (data) => {
    try {
        const sql = `WITH RECURSIVE DateRange AS (
                        SELECT DATE ${data.start} AS "date"
                        UNION ALL
                        SELECT ("date" + INTERVAL '1 day')::DATE
                        FROM DateRange
                        WHERE "date" < DATE ${data.end} - INTERVAL '1 day'
                    )

                    SELECT
                        h.name AS hotel_name,
                        h.description,
                        h.image,
                        h.city,
                        h.address
                    FROM 
                        roomdetails rd
                    LEFT JOIN 
                        inventory i ON rd.id = i."RoomDetailId" 
                                AND i.inventory_date BETWEEN ${data.start} AND  ${data.end}
                    JOIN
                        room r ON r.id = rd."RoomId"
                    JOIN
                        hotel h ON r."HotelId" = h.id
                    WHERE
                        i."RoomDetailId" IS NULL AND h.city LIKE '%${data.search}%'
                    GROUP BY 
                        h.name, h.description, h.image, h.city, h.address;`;
                    
        const hotel = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
        return hotel;
    } catch (error) {
        console.log(error);
        return "error";
    }
}

module.exports = {createHotel, getHotel, findHotel}