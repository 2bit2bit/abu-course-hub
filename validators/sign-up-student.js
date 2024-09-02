const Joi = require("joi");

const validateSignupStudent = async (req, res, next) => {
  try {
    await signupValidator.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(422).render("auth/signup-student", {
      pageTitle: "Sign Up - Student",
      path: "/signup-student",
      isLoggedIn: false,
      errorMessage: err.message,
      oldInput: {
        regNumber: req.body.regNumber,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      },
    });
  }
};

const signupValidator = Joi.object({
  regNumber: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "Registration Number is required",
    "string.min": "Registration Number must be at least 1 character long",
    "string.max":
      "Registration Number must be less than or equal to 50 characters",
  }),

  firstName: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "First Name is required",
    "string.min": "First Name must be at least 1 character long",
    "string.max": "First Name must be less than or equal to 50 characters",
  }),

  lastName: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "Last Name is required",
    "string.min": "Last Name must be at least 1 character long",
    "string.max": "Last Name must be less than or equal to 50 characters",
  }),

  password: Joi.string().trim().min(8).max(50).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must be less than or equal to 50 characters",
  }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm Password must match Password",
    "string.empty": "Confirm Password is required",
  }),
});

module.exports = validateSignupStudent;
