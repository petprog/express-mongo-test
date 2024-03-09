import { Router } from "express";

const router = Router();

import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";

router
  .get(
    "/api/users",
    query("filter")
      .isString()
      .notEmpty()
      .withMessage("Must not be empty")
      .isLength({ min: 3, max: 10 })
      .withMessage("Must be betweeen 3-10 characters"),
    (req, res) => {
      req.sessionStore.get(req.session.id, (err, sessionData) => {
        if (err) {
          console.log(err);
          throw err;
        }
      });
      const result = validationResult(req);

      const {
        query: { filter, value },
      } = req;
      if (filter && value)
        return res.send(
          mockUsers.filter((user) =>
            user[filter].toLowerCase().includes(value.toLowerCase())
          )
        );
      return res.send(mockUsers);
    }
  )
  .get("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { foundUserIndex } = req;
    const foundUser = mockUsers[foundUserIndex];
    if (!foundUser) return res.sendStatus(404);
    return res.send(foundUser);
  })
  .post("/api/users", checkSchema(createUserValidationSchema), (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });

    const data = matchedData(req);
    const { username, displayName } = data;
    const foundUser = mockUsers.find((user) => user.username === username);
    if (foundUser) {
      return res
        .status(400)
        .send({ message: "Bad Request.  Username already exists" });
    }
    const id = mockUsers[mockUsers.length - 1]?.id + 1 || 1;
    const newUser = { id, username, displayName };
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
  })
  .put("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const {
      body: { username, displayName },
      foundUserIndex,
    } = req;
    if (!username || !displayName) return res.sendStatus(400);

    mockUsers[foundUserIndex] = {
      id: mockUsers[foundUserIndex].id,
      username,
      displayName,
    };
    return res.status(200).send(mockUsers[foundUserIndex]);
  })
  .patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { body, foundUserIndex } = req;
    mockUsers[foundUserIndex] = {
      ...mockUsers[foundUserIndex],
      ...body,
    };
    return res.status(200).send(mockUsers[foundUserIndex]);
  })

  .delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { foundUserIndex } = req;
    mockUsers.splice(foundUserIndex, 1);
    return res.sendStatus(200);
  });

export default router;
