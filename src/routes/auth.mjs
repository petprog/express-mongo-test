import { Router } from "express";
import { mockUsers } from "../utils/constants.mjs";
import passport from "passport";

const router = Router();

router
  .post("/api/auth", passport.authenticate("local"), (req, res) => {
    res.sendStatus(200);
  })
  .get("/api/auth/status", (req, res) => {
    const { user } = req;
    return user ? res.send(user) : res.sendStatus(401);
  })
  .post("/api/auth/logout", (req, res) => {
    const { user } = req;
    if (!user) return res.sendStatus(401); // Not Authenticated
    req.logout((err) => {
      if (err) return res.sendStatus(400);
      return res.sendStatus(200);
    });
  })
  .get("/api/auth/discord", passport.authenticate("discord"))
  .get(
    "/api/auth/discord/redirect",
    passport.authenticate("discord"),
    (req, res) => {
      res.sendStatus(200);
    }
  );

export default router;
