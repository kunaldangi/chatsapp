"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const sequelize_1 = require("sequelize");
const User_1 = require("./Models/User");
class Database {
    constructor() {
        this.models = {};
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            let dbConfig = {
                host: process.env.DATABASE_HOST || "127.0.0.1",
                name: process.env.DATABASE_NAME || '',
                user: process.env.DATABASE_USER || '',
                password: process.env.DATABASE_PASSWORD || ''
            };
            this.sequelize = new sequelize_1.Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
                host: dbConfig.host,
                dialect: 'postgres',
                define: {
                    freezeTableName: true
                }
            });
            try {
                yield this.sequelize.authenticate();
                console.log(`Database connection has been established successfully with ${dbConfig.host}:${dbConfig.name}`);
            }
            catch (error) {
                console.log(`Unable to connect with database ${dbConfig.host}:${dbConfig.name}\nERROR: ${error}`);
            }
            this.models.User = (0, User_1.initializeUserModel)(this.sequelize);
            yield this.sequelize.sync({ alter: true });
        });
    }
}
exports.Database = Database;
