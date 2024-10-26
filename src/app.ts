import express, { Router } from "express";
import { setupMiddlewares } from "@/config";
import { setupRoutes } from "@/routes";

const app = express();
const router = Router();

setupMiddlewares(app);
setupRoutes(app);

app.use("/api", router);

export default app;
