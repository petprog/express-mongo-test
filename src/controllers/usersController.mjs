import { mockUsers } from "../utils/constants.mjs";
import { hashPassword } from "../utils/helper.mjs";
import { validationResult, matchedData } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";

export const handleGetUserById = (req, res) => {
  const { foundUserIndex } = req;
  const foundUser = mockUsers[foundUserIndex];
  if (!foundUser) return res.sendStatus(404);
  return res.send(foundUser);
};

export const handleCreateUser = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).send(result.array());
  const data = matchedData(req);
  try {
    data.password = hashPassword(data.password);
  } catch (err) {
    return res.sendStatus(400);
  }
  const newUser = new User(data);
  try {
    const savedUser = await newUser.save();
    return res.status(201).send(savedUser);
  } catch (err) {
    res.sendStatus(400);
  }
};
