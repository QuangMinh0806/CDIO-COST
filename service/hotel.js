const {Hotel} = require("../model/hotel");
const {Sequelize, Op} = require("sequelize");
const { sequelize } = require("../config/mysql");
const { find_room_hotel, convert} = require("../helper/find_room_search");
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
                        SELECT DATE '2024-11-11' AS "date"
                        UNION ALL
                        SELECT ("date" + INTERVAL '1 day')::DATE
                        FROM DateRange
                        WHERE "date" < DATE '2024-11-14' - INTERVAL '1 day'
                    )

                    SELECT
                        h.name AS hotel_name,
                        JSONB_AGG(
                            DISTINCT JSONB_BUILD_OBJECT(
                                'room_id', r.id,
                                'room_detail_id', rd.id,
                                'room_name', r.name,
                                'adult_count', r.adult_count,
                                'total_price', (
                                    SELECT SUM(
                                        COALESCE(
                                            (SELECT p.price FROM pricing p 
                                            WHERE p."RoomId" = r.id AND d.date BETWEEN p.start_date AND p.end_date LIMIT 1), 
                                            r.price_per_night
                                        )
                                    )
                                    FROM DateRange d
                                )
                            )
                        ) AS room_empty
                    FROM 
                        roomdetails rd
                    LEFT JOIN 
                        inventory i ON rd.id = i."RoomDetailId" 
                                AND i.inventory_date BETWEEN '2024-11-11' AND  '2024-11-14'
                    JOIN
                        room r ON r.id = rd."RoomId"
                    JOIN
                        hotel h ON r."HotelId" = h.id
                    WHERE
                        i."RoomDetailId" IS NULL
                    GROUP BY 
                        h.name;`;
        const hotel = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
        
        const result = find_room_hotel(hotel, 2);
        return convert(result);
    } catch (error) {
        console.log(error);
        return "error";
    }
}

module.exports = {createHotel, getHotel, findHotel}