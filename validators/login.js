const Joi = require("joi");

const validateLogin = async (req, res, next) => {
  try {
    await loginValidator.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      isLoggedIn: false,
      errorMessage: err.message,
      oldInput: {
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
      },
    });
  }
};

const loginValidator = Joi.object({
  phoneNumber: Joi.string()
    .trim()
    .custom((value, helpers) => {
      // Ensure the phone number starts with +234
      if (!value.startsWith("+234")) {
        return helpers.message(
          "It must be a Nigerian number starting with +234"
        );
      }

      // Validate the phone number format
      const phoneNumberPattern = /^\+234\d{10}$/;
      if (!phoneNumberPattern.test(value)) {
        return helpers.message("It must be a valid Nigerian number");
      }

      return value; // Return the validated phone number
    })
    .required(),

  password: Joi.string().trim().required(),
});

module.exports = validateLogin;
