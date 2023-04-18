// env 파일에서 환경변수를 가져옵니다.
require("dotenv").config();
import { DataSource } from "typeorm";

export const myDataSource = new DataSource({
  type: "mysql",
  host: process.env.TYPEORM_HOST,
  port: Number(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: ["./src/entity/*.ts"],
  synchronize: true,
  logging: true,
  subscribers: [],
  migrations: [],
});
