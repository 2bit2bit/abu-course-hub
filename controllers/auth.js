const userModel = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();
const crypto = require("crypto");

exports.getSignup = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    return res.render("auth/signup", {
      pageTitle: "Sign Up",
      path: "/signup",
      isLoggedIn: false,
      errorMessage: "",
      oldInput: {
        phoneNumber: "",
        username: "",
        password: "",
        confirmPassword: "",
      },
    });
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const { phoneNumber, username, password } = req.body;
    console.log(req.body.phoneNumber);
    let errorMessage = "";

    const isPhoneNumber = await userModel.findOne({ phoneNumber });
    if (isPhoneNumber) {
      errorMessage = "phoneNumber alredy exist, try login instead";
    }

    const isUsername = await userModel.findOne({ username });
    if (isUsername) {
      errorMessage = "username exist, try a different one";
    }

    if (isUsername || isPhoneNumber) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Sign Up",
        path: "/signup",
        isLoggedIn: false,
        errorMessage: errorMessage,
        oldInput: {
          phoneNumber: req.body.phoneNumber,
          username: req.body.username,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword,
        },
      });
    }
    const user = new userModel({ phoneNumber, username, password });

    await user.save();
    res.redirect("/login");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

exports.getLogin = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(error);
      next(error);
    }
    return res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      isLoggedIn: false,
      errorMessage: "",
      oldInput: {
        phoneNumber: "",
        password: "",
      },
    });
  });
};

exports.postLogin = async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  try {
    const user = await userModel.findOne({ phoneNumber });

    if (!user) {
      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        isLoggedIn: false,
        errorMessage: "invalid WhatsApp Number or password",
        oldInput: {
          phoneNumber: req.body.phoneNumber,
          password: req.body.password,
        },
      });
    }

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        isLoggedIn: false,
        errorMessage: "invalid WhatsApp Number or password",
        oldInput: {
          phoneNumber: req.body.phoneNumber,
          password: req.body.password,
        },
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();

    res.redirect("/");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(error);
      next(error);
    }
    res.redirect("/");
  });
};
