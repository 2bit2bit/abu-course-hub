const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/signup", authController.getSignup);

router.get("/login", authController.getLogin);

router.get("/reset-password", authController.getResetPassword);

module.exports = router;
