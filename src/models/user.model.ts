import { DataTypes, Model } from "sequelize";
import { z } from "zod";
import { db } from "@/config";

export const UserSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(3, "Name must be at least 3 characters long"),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  age: z.number().int().optional(),
  active: z.boolean().default(true),
  createdAt: z
    .date()
    .nullable()
    .default(() => new Date()),
  updatedAt: z.date().nullable().default(null),
  deletedAt: z.date().nullable().default(null),
});

export type UserSchemaType = z.infer<typeof UserSchema>;

export type CreateUserDTO = {
  name: string;
  email: string;
  age?: number;
  active?: boolean;
};

export type UpdateUserDTO = {
  name?: string;
  email?: string;
  age?: number;
  active?: boolean;
};

export class User extends Model<UserSchemaType> {
  declare id: number;
  declare name: string;
  declare email: string;
  declare age: number;
  declare active: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize: db,
    tableName: "users",
  }
);
