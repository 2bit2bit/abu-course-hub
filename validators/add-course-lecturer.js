const Joi = require("joi");

const courseValidator = Joi.object({
  title: Joi.string().min(3).max(100).required().trim(),
  code: Joi.string().length(7).required().trim(),
  semester: Joi.string().required(),
  department: Joi.string().min(2).max(100).required().trim(),
  level: Joi.string().required(),
});

const validateAddCourseLecturer = async (req, res, next) => {
  try {
    await courseValidator.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(422).render("dashboard/add-course-lecturer", {
      pageTitle: "Add Course - Lecturer",
      path: "/add-course-lecturer",
      isLoggedIn: req.session.isLoggedIn,
      errorMessage: err.message,
      role: req.session.role,
      oldInput: {
        title: req.body.title,
        code: req.body.code,
        semester: req.body.semester,
        department: req.body.department,
        level: req.body.level,
      },
    });
  }
};

module.exports = validateAddCourseLecturer;
