const userModel = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();
const crypto = require("crypto");

const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

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
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      },
    });
  });
};

exports.postSignup = async (req, res, next) => {
  const { email, username, password } = req.body;

  let errorMessage = "";

  const isEmail = await userModel.findOne({ email });
  if (isEmail) {
    errorMessage = "Email exist, try a different one";
  }

  const isUsername = await userModel.findOne({ username });
  if (isUsername) {
    errorMessage = "username exist,  try a different one";
  }

  if (isUsername || isEmail) {
    return res.status(422).render("auth/signup", {
      pageTitle: "Sign Up",
      path: "/signup",
      isLoggedIn: false,
      errorMessage: errorMessage,
      oldInput: {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      },
    });
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
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    return res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      isLoggedIn: false,
      errorMessage: '',
      oldInput: {
        email: '',
        password: '',
      },
    });
  });  
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        isLoggedIn: false,
        errorMessage: "invalid email or password",
        oldInput: {
          email: req.body.email,
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
        errorMessage: "invalid email or password",
        oldInput: {
          email: req.body.email,
          password: req.body.password,
        },
      });
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
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/reset-password", {
    pageTitle: "reset password",
    path: " ",
    isLoggedIn: false,
    errorMessage: message,
  });
};

exports.postResetPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const buffer = crypto.randomBytes(32);
    const token = buffer.toString("hex");

    const user = await userModel.findOne({ email });

    if (!user) {
      req.flash("error", "email not found");
      return res.redirect("/reset-password");
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;

    await user.save();

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Alticles Password Reset",
      html: `
      <p>You requested for a password reset</p>
      <p>click this <a href="http://localhost:8080/update-password/${token}">link</a> below to reset password</p>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.render("auth/check-email", {
      pageTitle: "Check your email",
      path: " ",
      isLoggedIn: false,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getUpdatePassword = async (req, res, next) => {
  const token = req.params.token;
  const user = await userModel.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  console.log(token, user);
  if (!user) {
    return res.send("invalid or expired token");
  }

  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/new-password", {
    pageTitle: "New Password",
    path: " ",
    isLoggedIn: false,
    userId: user._id.toString(),
    passwordToken: token,
    errorMessage: message,
  });
};

exports.postUpdatePassword = async (req, res, next) => {
  const userId = req.body.userId;
  const confirmPassword = req.body.confirmPassword;
  const password = req.body.password;
  const passwordToken = req.body.passwordToken;

  const user = await userModel.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return res.send("error: user not found");
  }

  user.password = password;
  await user.save();

  res.redirect("/login");
};
