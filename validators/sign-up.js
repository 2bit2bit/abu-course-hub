const Joi = require("joi");

const validateSignup = async (req, res, next) => {
  try {
    await signupValidator.validateAsync(req.body);
    next();
  } catch (err) {
    return res.render("auth/signup", {
      pageTitle: "Sign Up",
      path: "/signup",
      isLoggedIn: false,
      errorMessage: err.message,
      oldInput: {
        email: req.body.email,
        username:  req.body.username,
        password:  req.body.password,
        confirmPassword:  req.body.confirmPassword,
      },
    });    
  }
};

const signupValidator = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),

  username: Joi.string()
    .alphanum()
    .min(4)
    .max(30)
    .required()
    .trim()
    .lowercase(),

  password: Joi.string()
    .trim()
    .min(8)
    .max(30)
    .required(),

  confirmPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
});

module.exports = validateSignup;
