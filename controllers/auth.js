const studentModel = require("../models/student");
const lecturerModel = require("../models/lecturer");
const bcrypt = require("bcrypt");
require("dotenv").config();
const crypto = require("crypto");

exports.getSignupStudent = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    return res.render("auth/signup-student", {
      pageTitle: "Sign Up",
      path: "/signup-student",
      isLoggedIn: false,
      role: "none",
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

exports.getSignupLecturer = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    return res.render("auth/signup-lecturer", {
      pageTitle: "Sign Up",
      path: "/signup-lecturer",
      isLoggedIn: false,
      role: "none",
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

exports.postSignupStudent = async (req, res, next) => {
  try {
    const { regNumber, firstName, lastName, password } = req.body;
    let errorMessage = "";
    // Check if the registration number already exists
    const isRegNumber = await studentModel.findOne({ regNumber });
    if (isRegNumber) {
      errorMessage =
        "Registration number already exists, try logging in instead";
    }

    if (isRegNumber) {
      return res.status(422).render("auth/signup-student", {
        pageTitle: "Sign Up",
        path: "/signup-student",
        isLoggedIn: false,
        role: "none",
        errorMessage: errorMessage,
        oldInput: {
          regNumber: req.body.regNumber,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: req.body.password,
        },
      });
    }

    // Create a new student student
    const student = new studentModel({
      regNumber,
      firstName,
      lastName,
      password,
    });

    await student.save();
    res.redirect("/login-student");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

exports.postSignupLecturer = async (req, res, next) => {
  try {
    const { staffID, firstName, lastName, password, confirmPassword } =
      req.body;
    let errorMessage = "";
    // Check if the staff ID already exists
    const isStaffID = await lecturerModel.findOne({ staffID });
    if (isStaffID) {
      errorMessage = "Staff ID already exists, try logging in instead";
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      errorMessage = "Password and Confirm Password do not match";
    }

    if (isStaffID || errorMessage) {
      return res.status(422).render("auth/signup-lecturer", {
        pageTitle: "Sign Up - lecturer",
        path: "/signup-lecturer",
        isLoggedIn: false,
        role: "none",
        errorMessage: errorMessage,
        oldInput: {
          staffID: req.body.staffID,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword,
        },
      });
    }

    // Create a new lecturer
    const lecturer = new lecturerModel({
      staffID,
      firstName,
      lastName,
      password,
    });

    await lecturer.save();
    res.redirect("/login-lecturer");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

exports.getLoginStudent = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(error);
      next(error);
    }
    return res.render("auth/login-student", {
      pageTitle: "Login - student",
      path: "/login-student",
      isLoggedIn: false,
      role: "none",
      errorMessage: "",
      oldInput: {
        regNumber: "",
        password: "",
      },
    });
  });
};

exports.getLoginLecturer = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(error);
      next(error);
    }
    return res.render("auth/login-lecturer", {
      pageTitle: "Login - lecturer",
      path: "/login-lecturer",
      isLoggedIn: false,
      role: "none",
      errorMessage: "",
      oldInput: {
        staffID: "",
        password: "",
      },
    });
  });
};

exports.postLoginStudent = async (req, res, next) => {
  const { regNumber, password } = req.body;

  try {
    // Find the student by registration number
    const student = await studentModel.findOne({ regNumber });

    if (!student) {
      return res.status(422).render("auth/login-student", {
        pageTitle: "Login - Student",
        path: "/login-student",
        isLoggedIn: false,
        role: "none",
        errorMessage: "Invalid Registration Number or Password",
        oldInput: {
          regNumber: req.body.regNumber,
          password: req.body.password,
        },
      });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(422).render("auth/login-student", {
        pageTitle: "Login - Student",
        path: "/login-student",
        isLoggedIn: false,
        role: "none",
        errorMessage: "Invalid Registration Number or Password",
        oldInput: {
          regNumber: req.body.regNumber,
          password: req.body.password,
        },
      });
    }

    // Set session and redirect on successful login
    req.session.isLoggedIn = true;
    req.session.role = "student";
    req.session.user = student;
    await req.session.save();

    res.redirect("/all-course-student");
  } catch (err) {
    // Handle errors and pass them to the error handling middleware
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

exports.postLoginLecturer = async (req, res, next) => {
  const { staffID, password } = req.body;

  try {
    // Find the lecturer by registration number
    const lecturer = await lecturerModel.findOne({ staffID });

    if (!lecturer) {
      return res.status(422).render("auth/login-lecturer", {
        pageTitle: "Login - Lecturer",
        path: "/login-lecturer",
        isLoggedIn: false,
        role: "none",
        errorMessage: "Invalid staff ID or Password",
        oldInput: {
          staffID: req.body.staffID,
          password: req.body.password,  
        },
      });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, lecturer.password);

    if (!isMatch) {
      return res.status(422).render("auth/login-lecturer", {
        pageTitle: "Login - Lecturer",
        path: "/login-lecturer",
        isLoggedIn: false,
        role: "none",
        errorMessage: "Invalid Registration Number or Password",
        oldInput: {
          staffID: req.body.staffID,
          password: req.body.password,
        },
      });
    }

    // Set session and redirect on successful login
    req.session.isLoggedIn = true;
    req.session.role = "lecturer";
    req.session.user = lecturer;
    await req.session.save();

    res.redirect("/all-course-lecturer");
  } catch (err) {
    // Handle errors and pass them to the error handling middleware
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
