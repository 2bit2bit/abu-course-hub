const Course = require("../models/course");
const Student = require("../models/student");
const Material = require("../models/material"); // Adjust the path as necessary


exports.getAllCourseStudent = async (req, res, next) => {
  try {
    const { title, level, department } = req.query;

    // Create a filter object
    const filter = {};

    // Apply filters based on query parameters
    if (title) {
      filter.$or = [
        { title: { $regex: title, $options: "i" } }, // Case-insensitive search in title
        { code: { $regex: title, $options: "i" } }   // Case-insensitive search in course code
      ];
    }
    if (level) {
      filter.level = level;
    }
    if (department) {
      filter.department = department;
    }

    // Fetch filtered courses from the database
    const courses = await Course.find(filter);

    // Render a view to display filtered courses or send a JSON response
    res.render("dashboard-student/all-courses-student", {
      pageTitle: "All Courses",
      path: "/all-course-student",
      courses: courses,
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
      // Pass the current search parameters back to the view
      title,
      level,
      department,
    });
  } catch (err) {
    console.error(err);
    next(new Error("Failed to fetch courses."));
  }
};


exports.getCourseStudent = async (req, res, next) => {
  const courseId = req.params.id;
  const studentId = req.session.user._id; // Assume student ID is available in session

  try {
    // Fetch the course with the specified ID
    const course = await Course.findById(courseId);
    const materials = await Material.find({ course: courseId });

    const student = await Student.findById(studentId).populate("courses");
    const added = student.courses.some(
      (courseItem) => courseItem._id.toString() === courseId
    );

    if (!course) {
      return res.status(404).render("404", {
        pageTitle: "Page Not Found",
        path: "/404",
        isLoggedIn: req.session.isLoggedIn,
        role: req.session.role,
      });
    }

    // Render a view to display the course details or send a JSON response
    res.render("dashboard-student/course-student", {
      pageTitle: course.title,
      path: "/course-student",
      course: course,
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
      materials: materials, // Pass materials to the view
      added: added,
    });
  } catch (err) {
    console.error(err);
    next(new Error("Failed to fetch the course."));
  }
};

exports.getMyCoursesStudent = async (req, res, next) => {
  const studentId = req.session.user._id; // Assume student ID is available in session

  try {
    // Fetch the student with their courses
    const student = await Student.findById(studentId).populate('courses').exec();

    if (!student) {
      return res.status(404).render('404', {
        pageTitle: 'Student Not Found',
        path: '/404',
        isLoggedIn: req.session.isLoggedIn,
        role: req.session.role,
      });
    }

    // Pass the student's courses to the view
    res.render('dashboard-student/my-courses-student', {
      pageTitle: 'My Courses',
      path: '/my-course-student',
      courses: student.courses, // List of courses the student is enrolled in
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
    });
  } catch (err) {
    console.error(err);
    next(new Error('Failed to fetch student courses.'));
  }
};


exports.addCourseStudent = async (req, res, next) => {
  const courseId = req.params.id;
  const studentId = req.session.user._id; // Assuming the student's ID is stored in the session

  try {
    // Fetch the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).render("404", {
        pageTitle: "Student Not Found",
        path: "/404",
        isLoggedIn: req.session.isLoggedIn,
        role: req.session.role,
      });
    }

    // Check if the course is already added to the student's list
    if (student.courses.includes(courseId)) {
      return res.status(400).send("Course already added.");
    }

    // Add the course to the student's list of courses
    student.courses.push(courseId);
    await student.save();

    // Redirect or send a success response
    res.redirect(`/course-student/${courseId}`);
  } catch (err) {
    console.error(err);
    next(new Error("Failed to add course to student."));
  }
};

exports.removeCourseStudent = async (req, res, next) => {
  const courseId = req.params.id;
  const studentId = req.session.user._id; // Assuming the student's ID is stored in the session

  try {
    // Fetch the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).render("404", {
        pageTitle: "Student Not Found",
        path: "/404",
        isLoggedIn: req.session.isLoggedIn,
        role: req.session.role,
      });
    }

    // Remove the course from the student's list of courses
    student.courses = student.courses.filter(
      (course) => course.toString() !== courseId
    );
    await student.save();

    // Redirect or send a success response
    res.redirect(`/course-student/${courseId}`);
  } catch (err) {
    console.error(err);
    next(new Error("Failed to remove course from student."));
  }
};
