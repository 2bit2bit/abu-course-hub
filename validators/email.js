const Joi = require("joi");

const validateEmail = async (req, res, next) => {
  try {
    await emailValidator.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(422).render("auth/reset-password", {
      pageTitle: "reset password",
      path: " ",
      isLoggedIn: false,
      errorMessage: err.message,
      oldInput: {
        email: req.body.email,
      },
    });
  }
};

const emailValidator = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
});

module.exports = validateEmail;
