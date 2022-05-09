import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize/types';

dotenv.config();

interface Config {
  username: string;
  password: string;
  database: string;
  host: '127.0.0.1';
  dialect: Dialect;
  timezone: '+09:00';
}

interface IConfigGroup {
  development: Config;
  test: Config;
  production: Config;
}

const dbConfig: IConfigGroup = {
  development: {
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '+09:00',
  },
  test: {
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '+09:00',
  },
  production: {
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '+09:00',
  },
};

export default dbConfig;
