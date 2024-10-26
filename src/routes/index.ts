import { Router } from "express";
import { userRouter } from "./user.routes";

const appRoutes = Router();

appRoutes.use("/users", userRouter);

export { appRoutes };
