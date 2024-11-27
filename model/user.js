const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/mysql");
const bcryptjs = require("bcryptjs");


const User = sequelize.define("User",
    {
        fullname: DataTypes.TEXT,
        password: DataTypes.TEXT,
        email: DataTypes.TEXT,
        role : {
            type : DataTypes.TEXT,
            defaultValue : "customer"
        },
        phone: DataTypes.TEXT,
        image: {
            type: DataTypes.TEXT,
            defaultValue: "https://www.elevenforum.com/attachments/images-jpeg-2-jpg.45643/"
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.fn("NOW"),
        }
    },
    {
        tableName: "user"
    }
);




User.beforeCreate(async (user) => {
    const hashedPassword = await bcryptjs.hash(user.password, 10);
    user.password = hashedPassword;
});


User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        const hashedPassword = await bcryptjs.hash(user.password, 10);
        user.password = hashedPassword;
    }
})

module.exports = {User};