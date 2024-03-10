export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "Username must be between 5-32 characters",
    },
    notEmpty: {
      errorMessage: "Username must not be empty",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },

  displayName: {
    notEmpty: {
      errorMessage: "displayName must not be empty",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password must not be empty",
    },
  },
};

export const updateUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "Username must be between 5-32 characters",
    },
    notEmpty: {
      errorMessage: "Username must not be empty",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },

  displayName: {
    notEmpty: {
      errorMessage: "displayName must not be empty",
    },
  },
};

export const patchUserValidationSchema = {
  username: {},
  displayName: {},
};
