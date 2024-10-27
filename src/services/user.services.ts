import { UserSchemaType, UserSchema, CreateUserDTO, UpdateUserDTO } from "@/models";
import { FindUsersParams, UserRepository } from "@/repositories";
import { ZodIssue } from "zod";

type UserServiceDependencies = {
  userRepository: UserRepository;
};

export interface IUserService {
  create(userData: CreateUserDTO): Promise<UserSchemaType>;
  findById(userId: number): Promise<UserSchemaType>;
  update(userId: number, userData: UpdateUserDTO): Promise<UserSchemaType | null>;
  delete(userId: number): Promise<boolean>;
  findAll(params: FindUsersParams): Promise<UserSchemaType[]>;
}

export class UserService implements IUserService {
  private readonly userRepository: UserRepository;

  constructor({ userRepository }: UserServiceDependencies) {
    this.userRepository = userRepository;

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(userData: CreateUserDTO): Promise<UserSchemaType> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser)
      throw new Error(JSON.stringify({ status: 400, message: "User already exists" }));

    this.validateCreateOrUpdateUser(userData);

    return this.userRepository.create(userData);
  }

  async findAll(params: FindUsersParams): Promise<UserSchemaType[]> {
    const { minAge, maxAge, age } = params;
    if (minAge && maxAge && minAge > maxAge)
      throw new Error(
        JSON.stringify({
          status: 400,
          message: "Invalid age range: min age cannot be bigger than max age",
        })
      );

    if (minAge && minAge < 0)
      throw new Error(
        JSON.stringify({ status: 400, message: "Invalid min age: min age must be higher than 0" })
      );

    if (maxAge && maxAge < 0)
      throw new Error(
        JSON.stringify({ status: 400, message: "Invalid max age: max age must be higher than 0" })
      );

    if (age && (minAge || maxAge))
      throw new Error(
        JSON.stringify({ status: 400, message: "You can't use age with min age or max age" })
      );

    const users = await this.userRepository.findAll(params);

    if (!users.length)
      throw new Error(JSON.stringify({ status: 400, message: "No users were found" }));

    return users;
  }

  async findById(userId: number): Promise<UserSchemaType> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error(JSON.stringify({ status: 400, message: "User not found" }));

    return user;
  }

  async update(userId: number, userData: UpdateUserDTO): Promise<UserSchemaType | null> {
    const user = await this.findById(userId);

    const payload = {
      name: userData.name ?? user.name,
      email: userData.email ?? user.email,
      age: userData.age ?? user.age,
      active: userData.active ?? user.active,
    };

    this.validateCreateOrUpdateUser(payload);

    return this.userRepository.update(userId, payload);
  }

  async delete(userId: number): Promise<boolean> {
    await this.findById(userId);
    return this.userRepository.delete(userId);
  }

  private validateCreateOrUpdateUser(userData: CreateUserDTO | UpdateUserDTO): void {
    const result = UserSchema.safeParse(userData);

    if (!result.success)
      throw new Error(
        JSON.stringify({
          status: 422,
          message: "Invalid data",
          issues: result.error.issues.map((issue: ZodIssue) => issue.message),
        })
      );
  }
}
