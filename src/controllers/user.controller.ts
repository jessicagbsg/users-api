import { Request, Response, NextFunction } from "express";
import { UserService } from "@/services";
import { CreateOrUpdateUserDTO } from "@/models";
import { FindUsersParams } from "@/repositories";

type UserControllerDependencies = {
  userService: UserService;
};

export interface IUserController {
  create(req: Request, res: Response, next: NextFunction): Promise<void>;
  findAll(req: Request, res: Response, next: NextFunction): Promise<void>;
  findById(req: Request, res: Response, next: NextFunction): Promise<void>;
  update(req: Request, res: Response, next: NextFunction): Promise<void>;
  delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class UserController implements IUserController {
  private readonly userService: UserService;

  constructor({ userService }: UserControllerDependencies) {
    this.userService = userService;

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log({ userData: req.body });
      const userData: CreateOrUpdateUserDTO = req.body;
      const newUser = await this.userService.create(userData);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params: FindUsersParams = req.query as unknown as FindUsersParams;
      const users = await this.userService.findAll(params);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await this.userService.findById(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const updates: CreateOrUpdateUserDTO = req.body;
      const updatedUser = await this.userService.update(userId, updates);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const deleted = await this.userService.delete(userId);
      res.status(204).send(deleted);
    } catch (error) {
      next(error);
    }
  }
}