import { config } from "dotenv";
import { DataSource } from "typeorm";

config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  logging: !!process.env.LOGGING,
  logger: "simple-console",
  migrationsTableName: "migration",
  migrationsRun: false,
  entities: [
    __dirname + "/../database/entity/*.entity.ts",
    __dirname + "/../database/entity/*.entity.js",
  ],
  migrations: [
    __dirname + "/../database/migration/*.ts",
    __dirname + "/../database/migration/*.js",
  ],

  ssl:
    process.env.DB_SSL == "production"
      ? {
          rejectUnauthorized: false,
          ca: process.env.CA_DB,
        }
      : false,
});
export default AppDataSource;

AppDataSource.initialize()
  .then(() => {})
  .catch((error) => console.log(error));
