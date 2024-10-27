import express from "express";
import { setupMiddlewares } from "@/config";
import { appRoutes } from "@/routes";
import { errorHandler } from "./helpers";

const app = express();
setupMiddlewares(app);

app.use("/api", appRoutes);
app.use(errorHandler);

export { app };
