import { Sequelize } from "sequelize";

export const db = new Sequelize(
  process.env.DB_NAME ?? "users-app",
  process.env.DB_USER ?? "",
  process.env.DB_PASSWORD,
  {
    storage: process.env.DB_STORAGE,
    dialect: "sqlite",
  }
);
