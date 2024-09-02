const { default: mongoose } = require("mongoose");
const Material = require("../models/material"); // Adjust the path as necessary
const Course = require("../models/course"); // Adjust the path to your Course model


exports.getDahsboardLecturer = async (req, res, next) => {
  try {
    res.render("dashboard/dashboard-lecturer", {
      pageTitle: "Dashboard Lecturer",
      path: "/dashboard-lecturer",
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

// Get the form to add a new course
exports.getAddCourseLecturer = (req, res, next) => {
  try {
    res.render("dashboard/add-course-lecturer", {
      pageTitle: "Add Course - Lecturer",
      path: "/add-course-lecturer",
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
      errorMessage: "",
      oldInput: {
        title: "",
        code: "",
        semester: "",
        department: "",
        level: "",
      },
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

// Create a new course

exports.postAddCourseLecturer = async (req, res, next) => {
  const { title, code, semester, department, level } = req.body;
  const lecturerId = req.session.user._id;

  try {
    // Create new course with multiple lecturers
    const course = new Course({
      title,
      code,
      semester,
      department,
      level,
      lecturers: [lecturerId], // Assuming you want to add the current lecturer
    });

    await course.save();
    res.redirect("/all-course-lecturer");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

// Get all courses for the lecturer
exports.getAllCourseLecturer = async (req, res, next) => {
  const lecturerId = req.session.user._id;
  try {
    const courses = await Course.find({ lecturer: { $in: [lecturerId] } });
    res.render("dashboard/my-courses-lecturer", {
      pageTitle: "All Courses - Lecturer",
      path: "/all-course-lecturer",
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
      courses: courses,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 800;
    console.log(error);
    next(error);
  }
};

exports.getCourseLecturer = async (req, res, next) => {
  const courseId = req.params.id;

  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(404).render("404", {
      pageTitle: "Page Not Found",
      path: "/404",
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
    });
  }

  try {
    const course = await Course.findById(courseId);
    const materials = await Material.find({ course: courseId });

    if (!course) {
      return res.status(404).render("404", {
        pageTitle: "Page Not Found",
        path: "/404",
        isLoggedIn: req.session.isLoggedIn,
        role: req.session.role,
      });
    }

    res.render("dashboard/course-lecturer", {
      pageTitle: `${course.title} - Lecturer`,
      path: "/course-lecturer",
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
      course: {
        _id: course._id,
        title: course.title,
        code: course.code,
        semester: course.semester,
        department: course.department,
        level: course.level,
      },
      materials: materials, // Pass materials to the view
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

// Get the form to edit a specific course by ID
exports.getEditCourseLecturer = async (req, res, next) => {
  const courseId = req.params.id;
  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(404).render("404", {
      pageTitle: "Page Not Found",
      path: "/404",
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
    });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).render("404", {
        pageTitle: "Page Not Found",
        path: "/404",
        isLoggedIn: req.session.isLoggedIn,
        role: req.session.role,
      });
    }
    res.render("dashboard/edit-course-lecturer", {
      pageTitle: "Edit Course - Lecturer",
      path: "/edit-course-lecturer",
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
      errorMessage: "",
      oldInput: {
        _id: course._id,
        title: course.title,
        code: course.code,
        semester: course.semester,
        department: course.department,
        level: course.level,
      },
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

// Update a specific course by ID
exports.putEditCourseLecturer = async (req, res, next) => {
  const courseId = req.params.id;
  const { title, code, semester, department, level } = req.body;

  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(404).render("404", {
      pageTitle: "Page Not Found",
      path: "/404",
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
    });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).render("404", {
        pageTitle: "Page Not Found",
        path: "/404",
        isLoggedIn: req.session.isLoggedIn,
        role: req.session.role,
      });
    }

    course.title = title;
    course.code = code;
    course.semester = semester;
    course.department = department;
    course.level = level;

    await course.save();
    res.redirect("/all-course-lecturer");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

// Delete a specific course by ID
exports.deleteCourseLecturer = async (req, res, next) => {
  const courseId = req.params.id;
  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(404).render("404", {
      pageTitle: "Page Not Found",
      path: "/404",
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
    });
  }

  try {
    await Course.findByIdAndDelete(courseId);
    res.redirect("/all-course-lecturer");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

// Create new material for a course
exports.postAddMaterialLecturer = async (req, res, next) => {
  const courseId = req.params.courseId;
  const title = req.body.title;
  try {
    let fileUrl;
    let fileExtension;

    if (req.file) {
      // Use the S3 URL directly
      fileUrl = req.file.location;
      fileOriginalName = req.file.originalname;
    } else {
      return res.status(422).render("course/add-material", {
        pageTitle: "Add Material",
        path: `/add-material/${courseId}`,
        isLoggedIn: req.session.isLoggedIn,
        role: req.session.role,
        errorMessage: "Invalid file",
        oldInput: {
          title: req.body.title,
        },
      });
    }

    // Create and save the new material
    const material = new Material({
      title: fileOriginalName,
      fileUrl,
      course: courseId,
    });

    await material.save();
    res.redirect(`/course-lecturer/${courseId}`); // Redirect to the course page or wherever appropriate
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

// const { s3 } = require("../app");

exports.deleteMaterialLecturer = async (req, res, next) => {
  const materialId = req.params.materialId;
  try {
    // Find the material in the database
    const material = await Material.findById(materialId);

    if (!material) {
      return res.status(404).render("error", {
        pageTitle: "Error",
        path: "/error",
        isLoggedIn: req.session.isLoggedIn,
        role: req.session.role,
        errorMessage: "Material not found",
      });
    }

    // Delete the file from S3
    // const deleteParams = {
    //   Bucket: "vibingvisual", // Your S3 bucket name
    //   Key: material.fileUrl.split("/").slice(-2).join("/"), // Extract the key from fileUrl
    // };

    // await s3.send(new DeleteObjectCommand(deleteParams));

    // Delete the material from the database
    await material.remove();

    // Redirect or render a success page
    res.redirect(`/course-lecturer/${material.course}`); // Adjust the redirect URL if needed
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};
