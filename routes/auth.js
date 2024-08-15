const express = require("express");


const authController = require("../controllers/auth");


const router = express.Router();
const validateSignup = require('../validators/sign-up')
const validateLogin = require('../validators/login')
const validateEmail = require('../validators/email')

router.get("/signup", authController.getSignup);
router.post("/signup", validateSignup, authController.postSignup);

router.get("/login", authController.getLogin);
router.post("/login", validateLogin, authController.postLogin);

router.post("/logout", authController.postLogout);

// router.get("/reset-password", authController.getResetPassword);
// router.post("/reset-password", validateEmail, authController.postResetPassword);

// router.get("/update-password/:token", authController.getUpdatePassword);
// router.post("/update-password", authController.postUpdatePassword);

module.exports = router;
