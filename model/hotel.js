const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/mysql");
const { User } = require('./user');

const Hotel = sequelize.define("Hotel",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: DataTypes.TEXT,
        image: DataTypes.TEXT,
        country: DataTypes.STRING,
        city: DataTypes.STRING,
        address: DataTypes.STRING,
        amenity_type: DataTypes.JSON,
    },
    {
        tableName: "hotel",
        timestamps: true
    }
);

Hotel.belongsTo(User);
User.hasMany(Hotel);

module.exports = { Hotel };




