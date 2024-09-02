const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();
const validateSignupStudent = require("../validators/sign-up-student");
const validateSignupLecturer = require("../validators/sign-up-lecturer");
const validateLoginStudent = require("../validators/login-student");
const validateLoginLecturer = require("../validators/login-lecturer");

const validateEmail = require("../validators/email");

router.get("/signup-student", authController.getSignupStudent);
router.get("/signup-lecturer", authController.getSignupLecturer);

router.post(
  "/signup-student",
  validateSignupStudent,
  authController.postSignupStudent
);
router.post(
  "/signup-lecturer",
  validateSignupLecturer,
  authController.postSignupLecturer
);

router.get("/login-student", authController.getLoginStudent);
router.get("/login-lecturer", authController.getLoginLecturer);

router.post("/login-student", validateLoginStudent, authController.postLoginStudent);
router.post("/login-lecturer", validateLoginLecturer, authController.postLoginLecturer);

router.post("/logout", authController.postLogout);

module.exports = router;
