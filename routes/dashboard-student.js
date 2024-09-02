const express = require("express");

const dashboardController = require("../controllers/dashboard-student");

const router = express.Router();

// Student Dashboard
router.get("/all-course-student", dashboardController.getAllCourseStudent); // Get all courses

router.get("/course-student/:id", dashboardController.getCourseStudent); // Get a specific course by ID

router.get("/my-courses-student", dashboardController.getMyCoursesStudent); // Get all courses for a student
router.get("/add-course-student/:id", dashboardController.addCourseStudent); // Add a course
router.get(
  "/remove-course-student/:id",
  dashboardController.removeCourseStudent
); // remove a specific course

module.exports = router;
