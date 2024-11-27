const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/mysql");
const { Hotel } = require('./hotel');

const Services = sequelize.define("Services", 
    {
        service_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "services"
    }
);

Services.belongsTo(Hotel);
Hotel.hasMany(Services);

module.exports = { Services };
