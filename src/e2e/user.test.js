import request from "supertest";
import { connectTestDB } from "../configs/dbCon.mjs";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";

describe("create user and login", () => {
  let app;
  beforeAll(async () => {
    await connectTestDB();
    app = createApp();
  });

  it("should create the user", async () => {
    const response = await request(app).post("/api/users").send({
      username: "petprog",
      password: "hello123",
      displayName: "Petprog The Programmer",
    });
    expect(response.statusCode).toBe(201);
  });

  it("should login the user", async () => {
    const response = await request(app)
      .post("/api/auth")
      .send({
        username: "petprog",
        password: "hello123",
      })
      .then((res) => {
        return request(app)
          .get("/api/auth/status")
          .set("Cookie", res.headers["set-cookie"]);
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe("petprog");
    expect(response.body.displayName).toBe("Petprog The Programmer");
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
