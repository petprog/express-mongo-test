import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helper.mjs";

export const verifyCredentials = async (username, password, done) => {
  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser) throw new Error("User not found");
    if (!comparePassword(password, foundUser.password))
      throw new Error("Invalid Credentials");
    return done(null, foundUser);
  } catch (err) {
    return done(err, null);
  }
};

export const serialize = (user, done) => done(null, user.id);

export const deserialize = async (id, done) => {
  try {
    const foundUser = await User.findById(id, "-password");
    if (!foundUser) throw new Error("User not found");
    return done(null, foundUser);
  } catch (err) {
    return done(err, null);
  }
};
