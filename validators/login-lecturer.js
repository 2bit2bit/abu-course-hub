const Joi = require("joi");

const validateLoginLecturer = async (req, res, next) => {
  try {
    await loginValidator.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(422).render("auth/login-lecturer", {
      pageTitle: "Login - Lecturer",
      path: "/login-lecturer",
      isLoggedIn: false,
      errorMessage: err.message,
      oldInput: {
        staffID: req.body.staffID,
        password: req.body.password,
      },
    });
  }
};

const loginValidator = Joi.object({
  staffID: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      "string.empty": "Staff ID is required",
      "string.min": "Staff ID must be at least 1 character long",
      "string.max": "Staff ID must be less than or equal to 50 characters",
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

module.exports = validateLoginLecturer;
