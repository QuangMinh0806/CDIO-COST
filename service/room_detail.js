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



module.exports = {createRoomDetail, getRoomDetail}