const userModel = require("../models/user");
const bcrypt = require("bcrypt");

//add validation

exports.getSignup = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
  });

  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/signup",
    isLoggedIn: false,
  });
};

exports.postSignup = async (req, res, next) => {
  const { email, username, password, confirmPassword } = req.body;
  const user = new userModel({ email, username, password });

  try {
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};

exports.getLogin = (req, res, next) => {
  
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.redirect("/login");
    }

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      return res.redirect("/login");
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();

    res.redirect("/");
  } catch (err) {
    console.log(err); 
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

exports.getResetPassword = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
  });

  res.render("auth/reset-password", {
    pageTitle: "reset password",
    path: " ",
    isLoggedIn: false,
  });
};
