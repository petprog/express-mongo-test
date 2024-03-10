import request from "supertest";
import { connectTestDB } from "../configs/dbCon.mjs";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";

describe("User Creation and Login", () => {
  let app;

  beforeAll(async () => {
    await connectTestDB();
    app = createApp();
  });

  it("should create a user", async () => {
    const response = await request(app).post("/api/users").send({
      username: "petprog",
      password: "hello123",
      displayName: "Petprog The Programmer",
    });

    expect(response.statusCode).toBe(201);
  });

  it("should login the user", async () => {
    const loginResponse = await request(app).post("/api/auth").send({
      username: "petprog",
      password: "hello123",
    });

    const cookies = loginResponse.headers["set-cookie"];

    const statusResponse = await request(app)
      .get("/api/auth/status")
      .set("Cookie", cookies);

    expect(statusResponse.statusCode).toBe(200);
    expect(statusResponse.body.user.username).toBe("petprog");
    expect(statusResponse.body.user.displayName).toBe("Petprog The Programmer");
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});

describe("User Operations by ID", () => {
  let app;
  let userId;

  beforeAll(async () => {
    await connectTestDB();
    app = createApp();
  });

  it("should create, get, update, patch, and delete user by ID", async () => {
    // Create a user
    const createUserResponse = await request(app).post("/api/users").send({
      username: "taiwo",
      password: "hello123",
      displayName: "Taiwo F.",
    });

    userId = createUserResponse.body.user._id;
    expect(createUserResponse.statusCode).toBe(201);

    // Get the created user
    const getUserResponse = await request(app).get(`/api/users/${userId}`);
    expect(getUserResponse.statusCode).toBe(200);

    // Update the user
    const updateUserResponse = await request(app)
      .put(`/api/users/${userId}`)
      .send({
        username: "taiwo1",
        displayName: "Taiwo Farinu",
      });

    expect(updateUserResponse.statusCode).toBe(200);
    expect(updateUserResponse.body.user.username).toBe("taiwo1");
    expect(updateUserResponse.body.user.displayName).toBe("Taiwo Farinu");

    // Patch the user
    const patchUserResponse = await request(app)
      .patch(`/api/users/${userId}`)
      .send({
        displayName: "Taiwo F.",
      });

    expect(patchUserResponse.statusCode).toBe(200);
    expect(patchUserResponse.body.user.displayName).toBe("Taiwo F.");
    expect(patchUserResponse.body.user.username).toBe("taiwo1");

    // Delete the user
    const deleteResponse = await request(app).delete(`/api/users/${userId}`);
    expect(deleteResponse.statusCode).toBe(200);

    // Ensure the user is deleted
    const testResponse = await request(app).get(`/api/users/${userId}`);
    expect(testResponse.statusCode).toBe(400);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
