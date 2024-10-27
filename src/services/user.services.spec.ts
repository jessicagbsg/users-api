import { UserService } from "@/services";
import { UserRepository } from "@/repositories";
import { CreateUserDTO, UpdateUserDTO } from "@/models";
import { jest } from "@jest/globals";
import { userFactory } from "@/test-helpers/factories/user.factory";
import { fa, faker } from "@faker-js/faker/.";

jest.mock("@/repositories");

describe("UserService", () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService({ userRepository });
  });

  describe("create", () => {
    it("should create a user when data is valid", async () => {
      const userData: CreateUserDTO = {
        name: "John Doe",
        email: "johndoe@example.com",
        age: 25,
        active: true,
      };
      const user = userFactory.build({ ...userData });

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(user);

      const result = await userService.create(userData);

      expect(userRepository.create).toHaveBeenCalledWith(userData);
      expect(result).toMatchObject(userData);
    });

    it("should throw an error if user already exists", async () => {
      const userData = userFactory.build();

      userRepository.findByEmail.mockResolvedValue(userData);

      const result = userService.create(userData);

      expect(result).rejects.toThrow("User already exists");
    });
  });

  describe("findAll", () => {
    it("should return a list of users", async () => {
      const params = { limit: 10, offset: 0, age: 25 };
      const users = userFactory.buildList(8);

      userRepository.findAll.mockResolvedValue(users);

      const foundUsers = await userService.findAll(params);

      expect(userRepository.findAll).toHaveBeenCalledWith(params);
      expect(foundUsers.length).toBe(8);
    });

    it("should return a list of users with a name filter", async () => {
      const params = { name: "John" };
      const user = userFactory.build({ name: "John Doe" });
      const users = userFactory.buildList(5, { name: "Jane Doe" });
      users.push(user);

      userRepository.findAll.mockResolvedValue([user]);

      const foundUsers = await userService.findAll(params);

      expect(userRepository.findAll).toHaveBeenCalledWith(params);
      expect(foundUsers.length).toEqual(1);
    });

    it("should return a list of users with an email filter", async () => {
      const params = { email: "john" };
      const user = userFactory.build({ email: "john@email.com" });
      const users = userFactory.buildList(5, { email: "email@email.com" });
      users.push(user);

      userRepository.findAll.mockResolvedValue([user]);

      const foundUsers = await userService.findAll(params);

      expect(userRepository.findAll).toHaveBeenCalledWith(params);
      expect(foundUsers.length).toEqual(1);
    });

    it("should return a list of users with an age filter", async () => {
      const params = { age: 25 };
      const user = userFactory.build({ age: 25 });
      const users = userFactory.buildList(5, { age: 30 });
      users.push(user);

      userRepository.findAll.mockResolvedValue([user]);

      const foundUsers = await userService.findAll(params);

      expect(userRepository.findAll).toHaveBeenCalledWith(params);
      expect(foundUsers.length).toEqual(1);
    });

    it("should return a list of users with a minAge filter", async () => {
      const params = { minAge: 20 };
      const user = userFactory.build({ age: 25 });
      const users = userFactory.buildList(5, { age: 30 });
      users.push(user);

      userRepository.findAll.mockResolvedValue([user]);

      const foundUsers = await userService.findAll(params);

      expect(userRepository.findAll).toHaveBeenCalledWith(params);
      expect(foundUsers.length).toEqual(1);
    });

    it("should return a list of users with a maxAge filter", async () => {
      const params = { maxAge: 30 };
      const user = userFactory.build({ age: 25 });
      const users = userFactory.buildList(5, { age: 30 });
      users.push(user);

      userRepository.findAll.mockResolvedValue([user]);

      const foundUsers = await userService.findAll(params);

      expect(userRepository.findAll).toHaveBeenCalledWith(params);
      expect(foundUsers.length).toEqual(1);
    });

    it("should return a list of users with a minAge and maxAge filter", async () => {
      const params = { minAge: 20, maxAge: 30 };
      const user = userFactory.build({ age: 25 });
      const users = userFactory.buildList(5, { age: 30 });
      users.push(user);

      userRepository.findAll.mockResolvedValue([user]);

      const foundUsers = await userService.findAll(params);

      expect(userRepository.findAll).toHaveBeenCalledWith(params);
      expect(foundUsers.length).toEqual(1);
    });

    it("should throw an error if minAge is greater than maxAge", async () => {
      const params = { minAge: 30, maxAge: 20 };

      const result = userService.findAll(params);

      await expect(result).rejects.toThrow(
        "Invalid age range: min age cannot be bigger than max age"
      );
    });

    it("should throw an error if minAge is less than 0", async () => {
      const params = { minAge: -1 };

      const result = userService.findAll(params);

      await expect(result).rejects.toThrow("Invalid min age: min age must be higher than 0");
    });

    it("should throw an error if maxAge is less than 0", async () => {
      const params = { maxAge: -1 };

      const result = userService.findAll(params);

      await expect(result).rejects.toThrow("Invalid max age: max age must be higher than 0");
    });

    it("should throw an error if age is used with minAge or maxAge", async () => {
      const params = { age: 25, minAge: 20 };

      const result = userService.findAll(params);

      await expect(result).rejects.toThrow("You can't use age with min age or max age");
    });

    it("should throw an error if no users are found", async () => {
      userRepository.findAll.mockResolvedValue([]);

      const result = userService.findAll({});
      await expect(result).rejects.toThrow("No users were found");
    });
  });

  describe("findById", () => {
    it("should return a user when ID is valid", async () => {
      const user = userFactory.build();

      userRepository.findById.mockResolvedValue(user);

      const result = await userService.findById(user.id!);

      expect(userRepository.findById).toHaveBeenCalledWith(user.id);
      expect(result).toEqual(user);
    });

    it("should throw an error if user is not found", async () => {
      userRepository.findById.mockResolvedValue(null);

      const result = userService.findById(faker.number.int());

      await expect(result).rejects.toThrow("User not found");
    });
  });

  describe("update", () => {
    it("should update user information", async () => {
      const user = userFactory.build();
      const updateData: UpdateUserDTO = { name: "Jane Doe" };

      userRepository.findById.mockResolvedValue(user);
      userRepository.update.mockResolvedValue({ ...user, ...updateData });

      const updatedUser = await userService.update(user.id!, updateData);

      expect(userRepository.update).toHaveBeenCalledWith(
        user.id,
        expect.objectContaining(updateData)
      );
      expect(updatedUser?.name).toBe("Jane Doe");
    });

    it("should throw an error if user is not found during update", async () => {
      userRepository.findById.mockResolvedValue(null);

      const result = userService.update(faker.number.int(), {});

      await expect(result).rejects.toThrow("User not found");
    });
  });

  describe("delete", () => {
    it("should delete a user successfully", async () => {
      const user = userFactory.build();

      userRepository.findById.mockResolvedValue(user);
      userRepository.delete.mockResolvedValue(true);

      const result = await userService.delete(user.id!);

      expect(userRepository.delete).toHaveBeenCalledWith(user.id);
      expect(result).toBe(true);
    });

    it("should throw an error if user is not found during deletion", async () => {
      userRepository.findById.mockResolvedValue(null);

      const result = userService.delete(faker.number.int());

      await expect(result).rejects.toThrow("User not found");
    });
  });
});
