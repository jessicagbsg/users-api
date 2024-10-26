import { User, UserSchemaType, UserSchema } from "@/models";
import { Op } from "sequelize";

export interface IUserRepository {
  create(userData: UserSchemaType): Promise<User>;
  findById(userId: number): Promise<User | null>;
  update(userId: number, updates: Partial<UserSchemaType>): Promise<User | null>;
  delete(userId: number): Promise<boolean>;
  findAll(params: FindUsersParams): Promise<User[]>;
}

export type FindUsersParams = {
  limit: number;
  offset: number;
  minAge?: number;
  maxAge?: number;
  name?: string;
  email?: string;
};

export class UserRepository implements IUserRepository {
  constructor() {
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(userData: UserSchemaType): Promise<User> {
    return await User.create(userData);
  }

  async findAll({ limit, offset, minAge, maxAge, name, email }: FindUsersParams): Promise<User[]> {
    return await User.findAll({
      limit,
      offset,
      where: {
        name: name ? { [Op.iLike]: `%${name}%` } : undefined,
        email: email ? { [Op.iLike]: `%${email}%` } : undefined,
        age: {
          [Op.and]: [
            minAge ? { [Op.gte]: minAge } : undefined,
            maxAge ? { [Op.lte]: maxAge } : undefined,
          ].filter(Boolean),
        },
      },
    });
  }

  async findById(userId: number): Promise<User | null> {
    return await User.findByPk(userId);
  }

  async update(userId: number, updates: Omit<UserSchemaType, "id">): Promise<User | null> {
    const updatedRows = await User.update(updates, { where: { id: userId }, returning: true });
    return updatedRows[1][0] || null;
  }

  async delete(userId: number): Promise<boolean> {
    const deletedRows = await User.update({ deletedAt: new Date() }, { where: { id: userId } });
    return deletedRows[0] > 0;
  }
}
