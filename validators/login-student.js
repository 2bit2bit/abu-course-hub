const Joi = require("joi");

const validateLoginStudent = async (req, res, next) => {
  try {
    await loginValidator.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(422).render("auth/login-student", {
      pageTitle: "Login - Student",
      path: "/login-student",
      isLoggedIn: false,
      errorMessage: err.message,
      oldInput: {
        regNumber: req.body.regNumber,
        password: req.body.password,
      },
    });
  }
};

const loginValidator = Joi.object({
  regNumber: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      "string.empty": "Registration Number is required",
      "string.min": "Registration Number must be at least 1 character long",
      "string.max": "Registration Number must be less than or equal to 50 characters",
    }),

  password: Joi.string()
    .trim()
    .min(8)
    .max(50)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must be less than or equal to 50 characters",
    }),
});

module.exports = validateLoginStudent;
