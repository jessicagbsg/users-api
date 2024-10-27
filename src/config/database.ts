import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const db = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_STORAGE,
});

export const initializeDatabase = async () => {
  try {
    await db.authenticate();
    console.log("Database connected");

    await db.sync();
    console.log("Database synchronized and tables created");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
