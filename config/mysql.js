const {Sequelize} = require("sequelize");


const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE, 
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: "postgres",
    timezone: '+07:00',
    define: {
        timestamps: false,
        sync: {
            force: false
        },
        freezeTableName: true
    },
    dialectOptions: {
        charset: 'utf8mb4',
    },
    logging: false
});


sequelize.sync({alter : true});


const connectToDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Kết nối thành công DATABASE");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {sequelize, connectToDB};