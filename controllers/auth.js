exports.getSignup = (req, res, next) => {
    res.render("auth/signup", {
      pageTitle: "Sign Up",
      path: "/signup",
    });
  };


  exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
    });
  };

  exports.getResetPassword = (req, res, next) => {
    res.render("auth/reset-password", {
      pageTitle: "reset password",
      path: " ",
    });
  };
  