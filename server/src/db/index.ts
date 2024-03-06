// --- Types ---
import { Sequelize, ModelCtor, Model} from 'sequelize';

// --- Modeles ---
import { initializeUserModel } from './Models/User';
import { initializeOtpModel } from './Models/Otp';

export class Database {
    public sequelize: Sequelize | undefined;
    
    public user: ModelCtor<Model<any, any>> | undefined;
    public otp: ModelCtor<Model<any, any>> | undefined;

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

        this.user = initializeUserModel(this.sequelize);
        this.otp = initializeOtpModel(this.sequelize);
        
        await this.sequelize.sync({alter: true});
    }
}

const db: Database = new Database();
export default db;
