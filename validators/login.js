const Joi = require("joi");

const validateLogin = async (req, res, next) => {
  try {
    await loginValidator.validateAsync(req.body);
    next();
  } catch (err) {
    return res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      isLoggedIn: false,
      errorMessage: err.message,
      oldInput: {
        email: req.body.email,
        password:  req.body.password,
      },
    });    
  }
};

const loginValidator = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),

  password: Joi.string()
    .trim()
    .required()
 
});

module.exports = validateLogin;
