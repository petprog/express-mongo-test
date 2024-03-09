import { verifyCredentials } from "../../controllers/localStrategyController";
import { User } from "../../mongoose/schemas/user";
import { comparePassword } from "../../utils/helper";

jest.mock("../../mongoose/schemas/user");

jest.mock("../../utils/helper", () => ({
  comparePassword: jest.fn((password, hash) => `hashed_${password}` === hash),
}));

describe("verifyCredentials function", () => {
  it("should verify credentials and return found user if credentials are valid", async () => {
    const mockUser = { username: "testUser", password: "password123" };
    const mockFoundUser = { ...mockUser, password: "hashed_password123" };
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
