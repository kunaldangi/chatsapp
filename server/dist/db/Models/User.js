"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUserModel = void 0;
const sequelize_1 = require("sequelize");
function initializeUserModel(sequelize) {
    return sequelize.define('user', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },
        username: {
            type: sequelize_1.DataTypes.STRING(36),
            allowNull: false
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        }
    });
}
exports.initializeUserModel = initializeUserModel;
