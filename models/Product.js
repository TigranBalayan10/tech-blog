const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Product extends Model { };

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        monthly_bill: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        tag_id: {
            type:DataTypes.INTEGER, 
            allowNull: false,
            references: {
                model: 'tag',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        createdAt: sequelize.DATE,
        freezeTableName: true,
        underscored: true,
        modelName: 'product'
    }
);

module.exports = Product;