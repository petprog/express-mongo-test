import { hashPassword } from "../utils/helper.mjs";
import { validationResult, matchedData } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";

const removePassword = (user) => {
  const userWithoutPassword = { ...user.toObject() };
  delete userWithoutPassword.password;
  return userWithoutPassword;
};

export const handleGetUserById = (req, res) => {
  const { foundUserIndex } = req;
  const foundUser = mockUsers[foundUserIndex];
  if (!foundUser) return res.sendStatus(404);
  return res.send(foundUser);
};

export const handleGetUsers = async (req, res) => {
  const { username, limit } = req.query;
  let query = {};

  if (username) {
    query.username = username;
  }

  try {
    const users = await User.find(query)
      .select("-password")
      .limit(parseInt(limit));
    return res.status(200).send(users);
  } catch (err) {
    return res.sendStatus(400);
  }
};

export const handleGetUser = async (req, res) => {
  const { foundUser: user } = req;
  return res.status(200).send(removePassword(user));
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
    return res.status(201).send({ user: removePassword(savedUser) });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).send({ message: "User already exists" });
    return res.sendStatus(400);
  }
};

export const handleUpdateUser = async (req, res) => {
  const { foundUser: user, data } = req;
  user.username = data.username;
  user.displayName = data.displayName;
  try {
    const updatedUser = await user.save();
    return res.status(200).send({ user: removePassword(updatedUser) });
  } catch (err) {
    res.sendStatus(400);
  }
};

export const handlePatchUser = async (req, res) => {
  const { foundUser: user, data } = req;
  if (data.username) user.username = data.username;
  if (data.displayName) user.displayName = data.displayName;
  try {
    const patchedUser = await user.save();
    return res.status(200).send({ user: removePassword(patchedUser) });
  } catch (err) {
    res.sendStatus(400);
  }
};

export const handleDeleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await User.findByIdAndDelete(id);
    return res.sendStatus(200);
  } catch (err) {
    res.sendStatus(400);
  }
};
