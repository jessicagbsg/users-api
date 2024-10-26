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
