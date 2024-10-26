import express, { Router } from "express";
import { setupMiddlewares } from "./config/middlewares";
import { setupRoutes } from "./routes/routes";

const app = express();
const router = Router();

setupMiddlewares(app);
setupRoutes(app);

app.use("/api", router);

export default app;
