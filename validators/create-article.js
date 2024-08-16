const Joi = require('joi')

const validateCreateArticle = async (req, res, next) => {
  try {
    await createArticleValidator.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(422).render("user/create-article", {
      pageTitle: "Create Article",
      path: "/create-article",
      isLoggedIn: req.session.isLoggedIn,
      errorMessage: err.message,
      oldInput: {
        title: req.body.title,
        description: req.body.description,
        body: req.body.body,
        tags: req.body.tags,
        publish: req.body.publish,
      },
    });
  }
};

const createArticleValidator = Joi.object({
  title: Joi.string().min(4).max(60).required().trim(),
  description: Joi.string().min(3).max(160).required().trim(),
  body: Joi.string().min(5).max(32000).required().trim(),
  tags: Joi.string().min(0).max(50).trim(),
  publish: Joi.any(),
});

module.exports = validateCreateArticle;
