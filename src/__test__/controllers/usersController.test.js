import {
  handleCreateUser,
  handleGetUserById,
} from "../../controllers/usersController.mjs";
import { hashPassword, removePassword } from "../../utils/helper.mjs";
import { mockRequest, mockResponse } from "../mocks/users.mjs";
import validator from "express-validator";
import { User } from "../../mongoose/schemas/user.mjs";

jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => false),
    array: jest.fn(() => [
      { message: "Invalid Username" },
      { message: "Invalid Password" },
    ]),
  })),
  matchedData: jest.fn(() => ({
    username: "test",
    password: "password",
    displayName: "test_name",
  })),
}));

jest.mock("../../utils/helper.mjs", () => ({
  hashPassword: jest.fn((password) => `hashed_${password}`),
  removePassword: jest.fn((user) => {
    const { password, ...rest } = user;
    return rest;
  }),
}));

jest.mock("../../mongoose/schemas/user.mjs");

describe("get users", () => {
  it("should get user by id", () => {
    handleGetUserById(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).toHaveBeenCalledWith({
      id: 2,
      username: "jack",
      displayName: "Jack",
      password: "hello123",
    });
    expect(mockResponse.sendStatus).not.toHaveBeenCalled();
  });

  it("should call sendStatus with 404 when user not found", () => {
    const modifiedMockRequest = { ...mockRequest, foundUserIndex: 100 };
    handleGetUserById(modifiedMockRequest, mockResponse);
    expect(mockResponse.sendStatus).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    expect(mockResponse.send).not.toHaveBeenCalled();
  });
});

describe("create user", () => {
  const mockRequest = {};
  it("should return status of 400 and send errors when there are errors", async () => {
    await handleCreateUser(mockRequest, mockResponse);
    expect(validator.validationResult).toHaveBeenCalled();
    expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
    expect(validator.validationResult(mockRequest).isEmpty()).toBeFalsy;
    expect(validator.validationResult(mockRequest).array()[0].message).toBe(
      "Invalid Username"
    );
    expect(mockResponse.status).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledWith([
      { message: "Invalid Username" },
      { message: "Invalid Password" },
    ]);
  });

  it("should return status of 201 when and send the user created", async () => {
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));

    const saveMethod = jest
      .spyOn(User.prototype, "save")
      .mockResolvedValueOnce({
        id: 1,
        username: "test",
        password: "hashed_password",
        displayName: "test_name",
      });
    await handleCreateUser(mockRequest, mockResponse);
    expect(validator.matchedData).toHaveBeenCalled();
    expect(hashPassword).toHaveBeenCalled();
    expect(hashPassword).toHaveBeenCalledWith("password");
    expect(hashPassword).toHaveReturnedWith("hashed_password");
    expect(User).toHaveBeenCalled();
    expect(User).toHaveBeenCalledWith({
      username: "test",
      password: "hashed_password",
      displayName: "test_name",
    });
    expect(saveMethod).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(removePassword).toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledWith({
      user: {
        id: 1,
        username: "test",
        displayName: "test_name",
      },
    });
  });

  it("should return sendStatus of 400 when user cannot be saved into database", async () => {
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));

    const saveMethod = jest.spyOn(User.prototype, "save").mockRejectedValue({
      msg: "dddd",
    });
    await handleCreateUser(mockRequest, mockResponse);
    expect(validator.matchedData).toHaveBeenCalled();
    expect(hashPassword).toHaveBeenCalled();
    expect(hashPassword).toHaveBeenCalledWith("password");
    expect(hashPassword).toHaveReturnedWith("hashed_password");
    expect(User).toHaveBeenCalled();
    expect(User).toHaveBeenCalledWith({
      username: "test",
      password: "hashed_password",
      displayName: "test_name",
    });
    expect(saveMethod).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
  });
});
