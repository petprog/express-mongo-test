import { Router } from "express";
const router = Router();
import { param, checkSchema } from "express-validator";
import {
  createUserValidationSchema,
  updateUserValidationSchema,
  patchUserValidationSchema,
} from "../utils/validationSchemas.mjs";
import {
  handleGetUsers,
  handleGetUser,
  handleCreateUser,
  handleUpdateUser,
  handlePatchUser,
  handleDeleteUser,
} from "../controllers/usersController.mjs";
import { resolveUserById } from "../utils/middlewares.mjs";
// import { mockUsers } from "../utils/constants.mjs";
// import { resolveIndexByUserId } from "../utils/middlewares.mjs";

router
  .get("/api/users", handleGetUsers)
  .get(
    "/api/users/:id",
    param("id")
      .isLength({ min: 24, max: 24 })
      .withMessage("Must be 24 characters"),
    resolveUserById,
    handleGetUser
  )
  .post("/api/users", checkSchema(createUserValidationSchema), handleCreateUser)
  .put(
    "/api/users/:id",
    param("id")
      .isLength({ min: 24, max: 24 })
      .withMessage("Must be 24 characters"),
    checkSchema(updateUserValidationSchema),
    resolveUserById,
    handleUpdateUser
  )
  .patch(
    "/api/users/:id",
    param("id")
      .isLength({ min: 24, max: 24 })
      .withMessage("Must be 24 characters"),
    checkSchema(patchUserValidationSchema),
    resolveUserById,
    handlePatchUser
  )
  .delete(
    "/api/users/:id",
    param("id")
      .isLength({ min: 24, max: 24 })
      .withMessage("Must be 24 characters"),
    resolveUserById,
    handleDeleteUser
  );

export default router;
