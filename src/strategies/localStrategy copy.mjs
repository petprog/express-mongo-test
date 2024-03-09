import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  try {
    const foundUser = mockUsers.find((user) => user.id === id);
    if (!foundUser) throw new Error("User not found");
    done(null, foundUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy({ usernameField: "email" }, (username, password, done) => {
    try {
      const foundUser = mockUsers.find((user) => user.username === username);
      if (!foundUser) throw new Error("User not found");
      if (foundUser.password !== password)
        throw new Error("Invalid Credentials");
      done(null, foundUser);
    } catch (err) {
      done(err, null);
    }
  })
);
