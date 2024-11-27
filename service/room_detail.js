const {RoomDetails} = require("../model/room_detail");
const {Sequelize, Op} = require("sequelize");
const { sequelize } = require("../config/mysql");

const createRoomDetail = async (data) => {
    try {
        const check = await RoomDetails.findOne({
            where : {
                room_number : data.room_number
            }
        });
    
        if(check){
            return -1;
        }
    
        await RoomDetails.create(data);
    } catch (error) {
        console.log(error);
        return "error";
    }
}


const getRoomDetail = async (id) => {
    try {
        const sql = `SELECT 
                        rd.room_number,
                        r.name AS room_name,
                        r.price_per_night
                    FROM 
                        room r
                    JOIN 
                        hotel h ON r."HotelId" = h.id
                    JOIN 
                        roomdetails rd ON rd."RoomId" = r.id
                    WHERE
                        h."UserId" = ${id}`;
        
        const room = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });

        return room;
    } catch (error) {
        console.log(error);
        return "error";
    }
}



const getScheduleRoomDetail = async (id, data) => {
    try {
        const sql = `WITH RECURSIVE DateRange AS (
                        SELECT ${data.start} AS \`date\`
                        UNION ALL
                        SELECT DATE_ADD(date, INTERVAL 1 DAY)
                        FROM DateRange
                        WHERE date < DATE_SUB(${data.end}, INTERVAL 1 DAY)
                    )

                    SELECT
                        d.\`date\`,
                        rd.room_number,
                        CASE 
                            WHEN i.RoomDetailId IS NULL THEN 'empty'
                            ELSE i.status
                        END AS room_status
                    FROM 
                        DateRange d
                    CROSS JOIN 
                        roomdetails rd
                    LEFT JOIN 
                        inventory i ON rd.id = i.RoomDetailId 
                        AND i.inventory_date = d.\`date\`
                    JOIN
                        room r ON r.id = rd.RoomId
                    JOIN
                        hotel h ON r.HotelId = h.id
                    WHERE
                        h.UserId = ${id}
                    ORDER BY
                        d.\`date\`, rd.room_number;`;
        
        const room = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });

        return room;
    } catch (error) {
        console.log(error);
        return "error";
    }
}

module.exports = {createRoomDetail, getRoomDetail, getScheduleRoomDetail}