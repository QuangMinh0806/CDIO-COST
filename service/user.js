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


const getAllUser  = async (data) => {
    const { count, rows: user } = await User.findAndCountAll({
        attributes : ["id", "fullName", "email", "role"],
        where : {
            role : data
        },
        order : [
            ["id", "ASC"]
        ]
    });

    return { count, user };
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


module.exports = {registerUser, activeUser, loginUser, getUser, putUser, getAllUser, putUserForAdmin, findUser}