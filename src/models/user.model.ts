import { DataTypes, Model } from "sequelize";
import { z } from "zod";
import { db } from "@/config";

export const UserSchema = z.object({
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
  active: z.boolean().optional().default(true),
});

export type UserSchemaType = z.infer<typeof UserSchema>;

export class User extends Model<UserSchemaType> {}

User.init(
  {
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
      defaultValue: true,
    },
  },
  {
    sequelize: db,
    modelName: "User",
    tableName: "users",
  }
);
