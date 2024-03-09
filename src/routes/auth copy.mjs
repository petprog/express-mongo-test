import { Router } from "express";
import { mockUsers } from "../utils/constants.mjs";

const router = Router();

router
  .post("/api/auth", (req, res) => {
    const {
      body: { username, password },
    } = req;
    const foundUser = mockUsers.find((user) => user.username === username);
    if (!foundUser || foundUser.password !== password)
      return res.status(401).send({ msg: "BAD CREDENTIALS" });
    req.session.user = foundUser;
    return res.status(200).send(foundUser);
  })
  .get("/api/auth/status", (req, res) => {
    req.sessionStore.get(req.session.id, (err, sessionData) => {});
    const { user } = req.session;
    return user
      ? res.status(200).send(user)
      : res.status(401).send({ msg: "Not Authenticated" });
  });
export default router;
