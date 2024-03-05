import { Sequelize } from 'sequelize';
import { initializeUserModel } from './Models/User';

export class Database {
    public sequelize: Sequelize | undefined;
    public models: any = {};

    public async initialize(){ // we need this because constructor can't be async
        let dbConfig = {
            host: process.env.DATABASE_HOST || "127.0.0.1",
            name: process.env.DATABASE_NAME || '',
            user: process.env.DATABASE_USER || '',
            password: process.env.DATABASE_PASSWORD || ''
        };

        this.sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
            host: dbConfig.host,
            dialect: 'postgres',
            define: {
                freezeTableName: true
            }
        });

        try {
            await this.sequelize.authenticate();
            console.log(`Database connection has been established successfully with ${dbConfig.host}:${dbConfig.name}`);
        } catch (error) {
            console.log(`Unable to connect with database ${dbConfig.host}:${dbConfig.name}\nERROR: ${error}`)
        }

        this.models.User = initializeUserModel(this.sequelize);
        
        await this.sequelize.sync({alter: true});
    }
}
