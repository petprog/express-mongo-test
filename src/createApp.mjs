import routes from "./routes/index.mjs";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { loggingMiddleware } from "./utils/middlewares.mjs";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

import "./strategies/localStrategy.mjs"; // local strategy

import "./strategies/discordStrategy.mjs"; // discord strategy

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));

  app.use(loggingMiddleware);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: true,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60, // 1hr
      },
      store: MongoStore.create({ client: mongoose.connection.getClient() }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(routes);
  return app;
}
