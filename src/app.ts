import express from "express";
import { setupMiddlewares } from "@/config";
import { appRoutes } from "@/routes";

const app = express();
setupMiddlewares(app);

app.use("/api", appRoutes);

export { app };
