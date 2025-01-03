const {User} = require("../model/user");
const activeToken = require("../middleware/activeToken");
const sendMail = require("../config/sendMail");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Sequelize, Op} = require("sequelize");
const { Hotel } = require("../model/hotel");

const registerUser = async (data) => {
    try {
        const check = await User.findOne({
            where : {
                email : data.email
            }
        });
    
        if(check){
            return -1;
        }
    
        const user = {
            fullname : data.fullname,
            email    : data.email,
            password : data.password,
            phone    : data.phone,
            role : "customer"
        }
    
        const token = activeToken(user);
        const otp = token.code;
        sendMail({
            email : data.email,
            subject : "Xác nhận đăng ký tài khoản",
            message : otp
        })
        return token;
    } catch (error) {
        console.log(error);
        return "error";
    }
}

const activeUser = async(data) => {
    try {
        const newUser = jwt.verify(data.token, process.env.JWT);
        if(newUser.code != data.code){
            return -1;
        } 
        await User.create(newUser.user)
    } catch (error) {
        console.log(error);
        return "error";
    }


}



const loginUser  = async (data) => {
    try {
        let users = await User.findOne({
            where : {
                email : data.email
            }
        })
        

        if(!users){
            return -1;
        }
        else{
            const check = await bcryptjs.compare(data.password, users.password);
            if(!check){
                return -2;
            }
            else{
                return users;
            }

        }
    } catch (error) {
        console.log(error);
        return "error";
    }
}

const getUser  = async (id) => {
    const users = await User.findOne({
        where : {
            id : id
        }
    })
    return users;
    
}

//note
const putUser  = async (id, data) => {
    try {
        const user = await User.findByPk(id);
        if(data.password){
            const check = await bcryptjs.compare(data.password_old, user.password);
            if(check){
                user.update(data);
            }
            else{
                return -1;
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const putUserForAdmin  = async (id, data) => {
    try {
        const user = await User.findByPk(id);
        user.update(data);
    } catch (error) {
        console.log(error);
    }
}


const getAllUserGroup  = async (id) => {
    const sql = `WITH tmp AS (
                    SELECT
                        b.id AS booking_id,
                        b.total_price,
                        u.id,
                        u.fullname
                    FROM
                        booking b
                    JOIN
                        "user" u ON b."UserId" = u.id
                    JOIN
                        booking_detail bd ON bd."BookingId" = b.id
                    JOIN
                        roomdetails rd ON rd.id = bd."RoomDetailId"
                    JOIN
                        room r ON r.id = rd."RoomId"
                    JOIN
                        hotel h ON r."HotelId" = h.id
                    WHERE
                        h."UserId" = ${id}
                    GROUP BY
                        b.id, u.id
                )
                SELECT
                COUNT(p.booking_id) AS total,
                SUM(p.total_price) AS price,
                p.id,
                p.fullname
                FROM
                    tmp p
                GROUP BY
                    p.id, p.fullname;`;

    const user = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });

    return user;
}


const findUser  = async (data) => {
    const search = `%${data}%`;


    const user = User.findAll({
        attributes : ["id", "fullName", "email", "picture"],
        where: {
            role : "customer",
            [Op.or]: [
              Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('fullName')), {
                [Op.like]: search.toLowerCase()
              }),
              { email: { [Op.like]: search } }
            ]
        }
    })

    return user;
}


module.exports = {registerUser, activeUser, loginUser, getUser, putUser, getAllUserGroup, putUserForAdmin, findUser}