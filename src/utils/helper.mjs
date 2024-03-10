import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (plain, hashed) => {
  const match = bcrypt.compareSync(plain, hashed);
  return match;
};

export const removePassword = (user) => {
  const { password, ...rest } = user._doc;
  return rest;
};
