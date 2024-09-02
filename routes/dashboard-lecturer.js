const express = require("express");

const dashboardController = require("../controllers/dashboard-lecturer");

const validateAddCourseLecturer = require("../validators/add-course-lecturer");
const router = express.Router();

// Lecturer Dashboard
router.get("/dashboard-lecturer", dashboardController.getDahsboardLecturer);

// Lecturer Course Routes
router.get("/add-course-lecturer", dashboardController.getAddCourseLecturer); // Form to add a new course
router.post(
  "/add-course-lecturer",
  validateAddCourseLecturer,
  dashboardController.postAddCourseLecturer
); // Create a new course

router.get("/all-course-lecturer", dashboardController.getAllCourseLecturer); // Get all courses

router.get("/course-lecturer/:id", dashboardController.getCourseLecturer); // Get a specific course by ID

router.get(
  "/edit-course-lecturer/:id",
  dashboardController.getEditCourseLecturer
); // Form to edit a course
router.post(
  "/edit-course-lecturer/:id",
  dashboardController.putEditCourseLecturer
); // Update a specific course

router.post(
  "/delete-course-lecturer/:id",
  dashboardController.deleteCourseLecturer
); // Delete a specific course

// Lecturer Material Routes
router.post(
  "/add-material-lecturer/:courseId",
  dashboardController.postAddMaterialLecturer
); // Create new material

router.get(
  "/delete-material-lecturer/:materialId",
  dashboardController.deleteMaterialLecturer
); // Delete specific material

module.exports = router;
