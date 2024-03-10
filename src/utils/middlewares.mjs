import { mockUsers } from "./constants.mjs";
import { validationResult, matchedData } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";

export const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

export const resolveIndexByUserId = (req, res, next) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) {
    return res.status(400).send({ message: "Bad Request.  Invalid ID" });
  }
  const foundUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (foundUserIndex === -1) return res.sendStatus(404);
  req.foundUserIndex = foundUserIndex;
  next();
};

export const resolveUserById = async (req, res, next) => {
  const id = req.params.id;
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).send(result.array());
  const data = matchedData(req);
  let user;
  try {
    user = await User.findById(id, "-password");
  } catch (err) {
    res.sendStatus(400);
  }
  if (!user) {
    return res.status(400).send({ message: "No user matches id" });
  }
  req.foundUser = user;
  req.data = data;
  next();
};
