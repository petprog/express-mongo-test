import { mockUsers } from "./constants.mjs";

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
