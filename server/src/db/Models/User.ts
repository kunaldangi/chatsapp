import { Sequelize, DataTypes } from "sequelize";

export function initializeUserModel(sequelize: Sequelize){
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
}