import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { config } from "dotenv";
config();
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helper.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const foundUser = await User.findById(id);
    return foundUser ? done(null, foundUser) : done(null, null);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      let foundUser;
      try {
        foundUser = await User.findOne({
          provider_id: profile.id,
        });
      } catch (err) {
        return done(err, null);
      }
      try {
        if (!foundUser) {
          let randomString = Math.random().toString(36).substring(2);
          const newUser = new User({
            provider: "discord",
            provider_id: profile.id,
            username: profile.username,
            password: hashPassword(randomString),
          });
          const newSavedUser = await newUser.save();
          return done(null, newSavedUser);
        }
        return done(null, foundUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
