import passport from "passport";
import { Strategy } from "passport-discord";
import { config } from "dotenv";
config();
import { DiscordUser } from "../mongoose/schemas/discordUser.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const foundUser = await DiscordUser.findById(id);
    return foundUser ? done(null, foundUser) : done(null, null);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      let foundUser;
      try {
        foundUser = await DiscordUser.findOne({
          discordId: profile.id,
        });
      } catch (err) {
        return done(err, null);
      }
      try {
        if (!foundUser) {
          const newUser = new DiscordUser({
            username: profile.username,
            discordId: profile.id,
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
