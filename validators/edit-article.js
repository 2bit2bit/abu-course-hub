const Joi = require("joi");
const Article = require("../models/article");

const validateEditArticle = async (req, res, next) => {
  try {
    await editArticleValidator.validateAsync(req.body);
    next();
  } catch (err) {
    const article = await Article.findOne({
      _id: req.params.articleId,
    });
    return res.status(422).render("user/edit-article", {
      pageTitle: "edit Article",
      path: "/edit-article",
      isLoggedIn: req.session.isLoggedIn,
      errorMessage: err.message,
      article: article,
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

const editArticleValidator = Joi.object({
  title: Joi.string().min(4).max(60).required().trim(),
  description: Joi.string().min(10).max(160).required().trim(),
  body: Joi.string().min(30).max(32000).required().trim(),
  tags: Joi.string().min(0).max(50).trim(),
  publish: Joi.any(),
});

module.exports = validateEditArticle;
