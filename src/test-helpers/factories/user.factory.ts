import { UserSchemaType } from "@/models";
import { faker } from "@faker-js/faker";
import { Factory } from "fishery";

export const userFactory = Factory.define<UserSchemaType>(() => ({
  id: faker.number.int(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  age: faker.number.int({ min: 0, max: 100 }),
  active: faker.datatype.boolean(),
  createdAt: faker.date.recent({ days: 10 }),
  updatedAt: faker.date.recent({ days: 5 }),
  deletedAt: null,
}));
