import { Router } from "express";
const router = Router();
import {
  query,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import {
  handleGetUserById,
  handleCreateUser,
} from "../controllers/usersController.mjs";

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
  .get("/api/users/:id", resolveIndexByUserId, handleGetUserById)
  .post("/api/users", checkSchema(createUserValidationSchema), handleCreateUser)
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
