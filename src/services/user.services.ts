import { UserSchemaType, UserSchema, CreateOrUpdateUserDTO } from "@/models";
import { FindUsersParams, UserRepository } from "@/repositories";

type UserServiceDependencies = {
  userRepository: UserRepository;
};

export interface IUserService {
  create(userData: CreateOrUpdateUserDTO): Promise<UserSchemaType>;
  findById(userId: number): Promise<UserSchemaType | null>;
  update(userId: number, updates: CreateOrUpdateUserDTO): Promise<UserSchemaType | null>;
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

  async create(userData: CreateOrUpdateUserDTO): Promise<UserSchemaType> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) throw new Error("User with this email already exists");

    this.validateCreateOrUpdateUser(userData);

    return this.userRepository.create(userData);
  }

  async findAll(params: FindUsersParams): Promise<UserSchemaType[]> {
    const users = await this.userRepository.findAll(params);
    if (!users.length) throw new Error("No users were found");

    return users;
  }

  async findById(userId: number): Promise<UserSchemaType | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    return user;
  }

  async update(userId: number, updates: CreateOrUpdateUserDTO): Promise<UserSchemaType | null> {
    await this.validateIfUserExists(userId);
    this.validateCreateOrUpdateUser(updates);

    return this.userRepository.update(userId, updates);
  }

  async delete(userId: number): Promise<boolean> {
    await this.validateIfUserExists(userId);
    return this.userRepository.delete(userId);
  }

  private async validateIfUserExists(userId: number): Promise<void> {
    const existingUser = await this.findById(userId);
    if (!existingUser) throw new Error("User not found");
  }

  private validateCreateOrUpdateUser(userData: UserSchemaType): void {
    const result = UserSchema.safeParse(userData);

    if (!result.success) throw new Error(result.error.errors.join(", "));
  }
}
