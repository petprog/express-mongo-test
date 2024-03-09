import {
  verifyCredentials,
  deserialize,
  serialize,
} from "../../controllers/localStrategyController.mjs";
import { User } from "../../mongoose/schemas/user";
import { comparePassword } from "../../utils/helper";

jest.mock("../../mongoose/schemas/user");

jest.mock("../../utils/helper", () => ({
  comparePassword: jest.fn((password, hash) => `hashed_${password}` === hash),
}));

describe("verifyCredentials function", () => {
  it("should verify credentials and return found user if credentials are valid", async () => {
    const mockUser = { username: "testUser", password: "password123" };
    const mockFoundUser = {
      ...mockUser,
      password: "hashed_password123",
      id: "1",
    };
    const mockDone = jest.fn();

    User.findOne.mockResolvedValue(mockFoundUser);

    await verifyCredentials(mockUser.username, mockUser.password, mockDone);

    expect(User.findOne).toHaveBeenCalledWith({ username: mockUser.username });
    expect(comparePassword).toHaveBeenCalled();
    expect(comparePassword).toHaveBeenCalledWith(
      "password123",
      "hashed_password123"
    );
    expect(comparePassword).toHaveReturnedWith(true);
    expect(mockDone).toHaveBeenCalledWith(null, mockFoundUser);
  });

  it("should throw an error if user is not found", async () => {
    const mockUser = { username: "nonExistentUser", password: "password123" };
    const mockDone = jest.fn();

    User.findOne.mockResolvedValue(null);

    try {
      await verifyCredentials(mockUser.username, mockUser.password, mockDone);
    } catch (error) {
      expect(error).toEqual(new Error("User not found"));
    }

    expect(mockDone).toHaveBeenCalledWith(expect.any(Error), null);
  });

  it("should throw an error if credentials are invalid", async () => {
    const mockUser = { username: "testUser", password: "wrongPassword" };
    const mockFoundUser = {
      id: "1",
      username: "testUser",
      password: "hashed_password123",
    };
    const mockDone = jest.fn();

    User.findOne.mockResolvedValue(mockFoundUser);

    try {
      await verifyCredentials(mockUser.username, mockUser.password, mockDone);
    } catch (error) {
      expect(error).toEqual(new Error("Invalid Credentials"));
    }
    expect(comparePassword).toHaveBeenCalled();
    expect(comparePassword).toHaveBeenCalledWith(
      "wrongPassword",
      "hashed_password123"
    );

    expect(comparePassword).toHaveReturnedWith(false);
    expect(mockDone).toHaveBeenCalledWith(expect.any(Error), null);
  });

  it("should return an error if an error occurs during the process", async () => {
    const mockUser = { username: "testUser", password: "password123" };
    const mockDone = jest.fn();

    User.findOne.mockRejectedValue(new Error("Database error"));

    try {
      await verifyCredentials(mockUser.username, mockUser.password, mockDone);
    } catch (error) {
      expect(error).toEqual(new Error("Database error"));
    }

    expect(mockDone).toHaveBeenCalledWith(expect.any(Error), null);
  });
});

describe("Serialize function", () => {
  it("should serialize with user.id after user is found", async () => {
    const mockFoundUser = {
      id: "1",
      username: "testUser",
      password: "hashed_password123",
    };
    const mockDone = jest.fn();
    serialize(mockFoundUser, mockDone);
    expect(mockDone).toHaveBeenCalled();
    expect(mockDone).toHaveBeenCalledWith(null, mockFoundUser.id);
  });
});

describe("Deserialize function", () => {
  it("should deserialize with user.id, show be done with user and null error", async () => {
    const mockId = "1";
    const mockFoundUser = {
      id: "1",
      username: "testUser",
      password: "hashed_password123",
    };
    const mockDone = jest.fn();
    User.findById.mockResolvedValue(mockFoundUser);

    await deserialize(mockId, mockDone);
    expect(mockDone).toHaveBeenCalled();
    expect(mockDone).toHaveBeenCalledWith(null, mockFoundUser);
  });

  it("should be done with user after user is found when deserializing with user.id", async () => {
    const mockId = "1";
    const mockFoundUser = {
      id: "1",
      username: "testUser",
      password: "hashed_password123",
    };
    const mockDone = jest.fn();
    User.findById.mockResolvedValue(mockFoundUser);

    await deserialize(mockId, mockDone);
    expect(mockDone).toHaveBeenCalled();
    expect(mockDone).toHaveBeenCalledWith(null, mockFoundUser);
  });

  it("should be done with error after user is not found when deserializing with user.id", async () => {
    const mockId = "1";
    const mockDone = jest.fn();
    User.findById.mockResolvedValue(null);

    await deserialize(mockId, mockDone);
    expect(mockDone).toHaveBeenCalled();
    expect(mockDone).toHaveBeenCalledWith(new Error("User not found"), null);
  });

  it("should be done with error after database error occured when deserializing with user.id", async () => {
    const mockId = "1";
    const mockDone = jest.fn();
    User.findById.mockRejectedValue(new Error("Database error"));

    await deserialize(mockId, mockDone);
    expect(mockDone).toHaveBeenCalled();
    expect(mockDone).toHaveBeenCalledWith(new Error("Database error"), null);
  });
});
