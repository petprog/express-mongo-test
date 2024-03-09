import passport from "passport";
import { Strategy } from "passport-local";
import {
  verifyCredentials,
  deserialize,
  serialize,
} from "../controllers/localStrategyController.mjs";

passport.serializeUser(serialize);

passport.deserializeUser(deserialize);

export default passport.use(new Strategy(verifyCredentials));
