import { Router } from "express";
import { UserController } from "@/controllers";
import { UserRepository } from "@/repositories";
import { UserService } from "@/services";

const userRepository = new UserRepository();
const userService = new UserService({ userRepository });
const userController = new UserController({ userService });

const userRouter = Router();

userRouter.post("/create", userController.create);
userRouter.get("/", userController.findAll);
userRouter.get("/:id", userController.findById);
userRouter.put("/:id", userController.update);
userRouter.delete("/:id", userController.delete);

export { userRouter };
