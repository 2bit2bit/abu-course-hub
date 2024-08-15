const Joi = require("joi");

const validateSignup = async (req, res, next) => {
  try {
    await signupValidator.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(422).render("auth/signup", {
      pageTitle: "Sign Up",
      path: "/signup",
      isLoggedIn: false,
      errorMessage: err.message,
      oldInput: {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      },
    });
  }
};

const signupValidator = Joi.object({
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

  username: Joi.string()
    .alphanum()
    .min(4)
    .max(30)
    .required()
    .trim()
    .lowercase(),

  password: Joi.string().trim().min(8).max(30).required(),

  confirmPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
});

module.exports = validateSignup;
