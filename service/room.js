const {Room} = require("../model/room");
const {Sequelize, Op} = require("sequelize");
const {find_room} = require("../helper/find_room");
const {convertData} = require("../helper/convertdata");
const { sequelize } = require("../config/mysql");

const createRoom = async (data) => {
    try {
        const check = await Room.findOne({
            where : {
                name : data.name
            }
        });
    
        if(check){
            return -1;
        }

        await Room.create(data);
    } catch (error) {
        console.log(error);
        return "error";
    }
}

//Gợi ý phòng
const getSuggestRoom = async (id, data) => {
    try {
        const sql = `WITH RECURSIVE DateRange AS (
                        SELECT DATE ${data.start} AS "date"
                        UNION ALL
                        SELECT ("date" + INTERVAL '1 day')::DATE
                        FROM DateRange
                        WHERE "date" < DATE ${data.end} - INTERVAL '1 day'
                    )

                    SELECT 
                        r.id AS room_id,
                        rd.id AS room_detail_id,
                        r.name AS room_name, 
                        r.adult_count,
                        SUM(
                            COALESCE(
                                (SELECT p.price FROM pricing p 
                                WHERE p."RoomId" = r.id AND d.date BETWEEN p.start_date AND p.end_date LIMIT 1), 
                                r.price_per_night
                            )
                        ) AS total_price
                    FROM 
                        DateRange d
                    CROSS JOIN 
                        roomdetails rd
                    JOIN 
                        room r ON rd."RoomId" = r.id
                    LEFT JOIN 
                        inventory i ON rd.id = i."RoomDetailId" 
                                AND i.inventory_date BETWEEN  ${data.start} AND  ${data.end}
                    WHERE
                        r."HotelId" = ${id} AND i."RoomDetailId" IS NULL AND r.adult_count <= ${data.num}
                    GROUP BY 
                        rd.id, r.id, r.name;`;

        const room = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
        let result = [];
        find_room(room, 0, data.num, [], result);
        
        return convertData(result);
    } catch (error) {
        console.log(error);
        return "error";
    }
}


//Trạng thái của phòng trong khách sạn
const getAllRoom = async (id, data) => {
    try {
        const sql = `SELECT
                        b.id AS booking_id,
                        rd.room_number,
                        bd.id AS booking_detail_id,
                        CASE 
                            WHEN b.checkin < ${data.start} THEN ${data.start}
                            ELSE b.checkin
                        END AS checkin,
                        CASE 
                            WHEN b.checkout > ${data.end} THEN ${data.end}
                            ELSE b.checkout
                        END AS checkout,
                        b.status
                    FROM
                        booking b
                    JOIN
                        booking_detail bd ON bd."BookingId" = b.id
                    JOIN
                        roomdetails rd ON rd.id = bd."RoomDetailId"
                    JOIN
                        room r ON r.id = rd."RoomId"
                    JOIN
                        hotel h ON r."HotelId" = h.id
                        AND (
                            b.checkin BETWEEN ${data.start} AND ${data.end}
                            OR b.checkout BETWEEN ${data.start} AND ${data.end}
                        )
                    WHERE
                        h."UserId" = ${id}
                    ORDER BY
                        rd.room_number;`;

        
        const room = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });      

        return room;
    } catch (error) {
        console.log(error);
        return "error";
    }
}



const getRoom = async (id) => {
    try {
        const sql = `SELECT 
                        r.id,
                        r.name AS room_name,
                        r.adult_count,
                        r.price_per_night,
                        COUNT(rd.id) AS room_count
                    FROM 
                        Room r
                    LEFT JOIN 
                        RoomDetails rd ON rd."RoomId" = r.id
                    WHERE
                        r."HotelId" = ${id}
                    GROUP BY
                        r.id`;
        
        const room = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });

        return room;
    } catch (error) {
        console.log(error);
        return "error";
    }
}


const getRoomById = async (id) => {
    try {
        const room = await Room.findByPk(id);
        return room;
    } catch (error) {
        console.log(error);
        return "error";
    }
}

const getRoomEmpty = async (id, data) => {
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
                                AND i.inventory_date BETWEEN ${data.start} AND  ${data.end}
                    JOIN
                        room r ON r.id = rd."RoomId"
                    JOIN
                        hotel h ON r."HotelId" = h.id
                    WHERE
                        i."RoomDetailId" IS NULL AND h.id = ${id}
                    GROUP BY 
                        h.name;`;
        
        const room = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });

        return room;
    } catch (error) {
        console.log(error);
        return "error";
    }
}

module.exports = {createRoom, getSuggestRoom, getAllRoom, getRoom, getRoomById, getRoomEmpty}