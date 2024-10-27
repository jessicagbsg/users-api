import { CreateUserDTO, UpdateUserDTO, User, UserSchemaType } from "@/models";
import { Op, WhereOptions } from "sequelize";

export interface IUserRepository {
  create(userData: CreateUserDTO): Promise<UserSchemaType>;
  findAll(params: FindUsersParams): Promise<UserSchemaType[]>;
  findById(userId: number): Promise<UserSchemaType | null>;
  findByEmail(userEmail: string): Promise<UserSchemaType | null>;
  update(userId: number, userData: UpdateUserDTO): Promise<UserSchemaType | null>;
  delete(userId: number): Promise<boolean>;
}

export type FindUsersParams = {
  limit?: number;
  offset?: number;
  name?: string;
  email?: string;
  age?: number;
  minAge?: number;
  maxAge?: number;
};

export class UserRepository implements IUserRepository {
  constructor() {
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.findByEmail = this.findByEmail.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(userData: CreateUserDTO): Promise<UserSchemaType> {
    return (await User.create({ ...userData, active: userData.active ?? true })).dataValues;
  }

  async findAll(params: FindUsersParams): Promise<UserSchemaType[]> {
    const { limit, offset, minAge, maxAge, name, email } = params;
    const where = this.buildWhereClause({ minAge, maxAge, name, email });
    const users = await User.findAll({
      limit,
      offset,
      where,
    });

    return users.map((user) => user.dataValues);
  }

  private buildWhereClause({ minAge, maxAge, name, email, age }: Partial<FindUsersParams>) {
    const where: WhereOptions = { deletedAt: null };

    if (name) where.name = { [Op.like]: `%${name}%` };

    if (email) where.email = { [Op.like]: `%${email}%` };

    if (age && !(minAge || maxAge)) where.age = age;

    if (!age && (minAge || maxAge)) {
      where.age = {
        [Op.and]: [
          minAge ? { [Op.gte]: minAge } : undefined,
          maxAge ? { [Op.lte]: maxAge } : undefined,
        ].filter(Boolean),
      };
    }

    return where;
  }

  async findById(userId: number) {
    const user = await User.findOne({ where: { id: userId, deletedAt: null } });
    return user?.dataValues ?? null;
  }

  async findByEmail(userEmail: string): Promise<UserSchemaType | null> {
    const user = await User.findOne({ where: { email: userEmail, deletedAt: null } });
    return user?.dataValues ?? null;
  }

  async update(userId: number, userData: UpdateUserDTO): Promise<UserSchemaType | null> {
    const [updatedRows] = await User.update(userData, {
      where: { id: userId },
    });

    return updatedRows > 0 ? this.findById(userId) : null;
  }

  async delete(userId: number): Promise<boolean> {
    const deletedRows = await User.update({ deletedAt: new Date() }, { where: { id: userId } });
    return deletedRows[0] > 0;
  }
}
