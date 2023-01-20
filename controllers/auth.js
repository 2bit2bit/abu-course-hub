const userModel = require("../models/user");
const bcrypt = require("bcrypt");
require('dotenv').config()

const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  }
});

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");

  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/signup",
    isLoggedIn: false,
    errorMessage: message,
  });
};

exports.postSignup = async (req, res, next) => {
  const { email, username, password, confirmPassword } = req.body;

  const isEmail = await userModel.findOne({ email });
  if (isEmail) {
    req.flash("error", "Email exist, try forget password");
  }

  const isUsername = await userModel.findOne({ username });
  if (isUsername) {
    req.flash("error", "username exist, try a different one");
  }

  if (isUsername || isEmail) {
    return res.redirect("/signup");
  }
  const user = new userModel({ email, username, password });

  try {
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  // req.session.destroy((err) => {
  //   console.log(err);
  // });

  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    csrfToken: req.csrfToken(),
    errorMessage: message,
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      req.flash("error", "invalid email or password");
      return res.redirect("/login");
    }

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      req.flash("error", "invalid email or password");
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
  res.render("auth/reset-password", {
    pageTitle: "reset password",
    path: " ",
    isLoggedIn: false,
  });
};

exports.postResetPassword = (req, res, next) => {
  const email = req.body.email;

  let mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: 'Nodemailer Project',
    text: 'Hi from your nodemailer project'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.render("auth/check-email", {
    pageTitle: "Check your email",
    path: " ",
    isLoggedIn: false,
  });
};
