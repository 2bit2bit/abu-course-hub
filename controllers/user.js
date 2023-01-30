const Article = require("../models/article");
const calcReadingTime = require("../utils/reading_time");
const Datauri = require("datauri/parser");
const path = require("path");

const cloudinary = require("cloudinary").v2;
const parser = new Datauri();

exports.getCreateArticle = (req, res, next) => {
  return res.render("user/create-article", {
    pageTitle: "Create Article",
    path: "/create-article",
    isLoggedIn: req.session.isLoggedIn,
    errorMessage: "",
    oldInput: {
      title: "",
      description: "",
      body: "",
      tags: "",
      publish: "",
    },
  });
};

exports.postCreateArticle = async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const tags = req.body.tags.split(",").map((tag) => {
    return tag.trim();
  });

  try {
    let image;
    if (req.file) {
      const dataUri = (req) =>
        parser.format(
          path.extname(req.file.originalname).toString(),
          req.file.buffer
        );
      const file = dataUri(req).content;

      image = (await cloudinary.uploader.upload(file, { quality: 30 })).url;
    } else {
      return res.status(422).render("user/create-article", {
        pageTitle: "Create Article",
        path: "/create-article",
        isLoggedIn: req.session.isLoggedIn,
        errorMessage: "invalid image",
        oldInput: {
          title: req.body.title,
          description: req.body.description,
          body: req.body.body,
          tags: req.body.tags,
          publish: req.body.publish,
        },
      });
    }

    const body = req.body.body;

    const publish = req.body.publish;
    const author = req.session.user;
    const reading_time = calcReadingTime.calcReadingTime(body);
    const article = new Article({
      title,
      description,
      author,
      reading_time,
      tags,
      body,
      image,
    });

    if (publish) {
      article.state = "published";
    }

    await article.save();
    res.redirect("my-articles");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

exports.getMyArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({
      author: req.session.user,
    }).sort({ timestamp: -1 });

    res.render("user/my-articles", {
      pageTitle: "My Articles",
      path: "/my-articles",
      isLoggedIn: req.session.isLoggedIn,
      articles: articles,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

exports.getEditArticle = async (req, res, next) => {
  const { articleId } = req.params;
  try {
    const article = await Article.findOne({
      _id: articleId,
    });

    res.render("user/edit-article", {
      pageTitle: article.title,
      path: " ",
      isLoggedIn: req.session.isLoggedIn,
      article: article,
      errorMessage: "",
      oldInput: {
        title: article.title,
        description: article.description,
        body: article.body,
        tags: article.tags,
      },
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

exports.postEditArticle = async (req, res, next) => {
  const { articleId } = req.params;

  try {
    const article = await Article.findOne({
      _id: articleId,
      author: req.session.user,
    });

    if (!article) {
      return res.send("article not found");
    }

    const title = req.body.title;
    const description = req.body.description;
    const tags = req.body.tags.split(",").map((tag) => {
      return tag.trim();
    });
    const body = req.body.body;
    const reading_time = calcReadingTime.calcReadingTime(body);

    article.title = title;
    article.description = description;
    article.reading_time = reading_time;
    article.tags = tags;
    article.body = body;

    await article.save();

    res.redirect(`/my-articles`);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

exports.postUpdateState = async (req, res, next) => {
  const articleId = req.params.articleId;

  try {
    const article = await Article.findOne({
      _id: articleId,
      author: req.session.user,
    });

    if (article.state == "draft") {
      article.state = "published";
    } else {
      article.state = "draft";
    }

    await article.save();
    res.redirect("/my-articles");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};

exports.postDeletetArticle = async (req, res, next) => {
  const articleId = req.params.articleId;

  try {
    const article = await Article.findOneAndDelete({
      _id: articleId,
      author: req.session.user,
    });

    if (article.image.split("/").length > 7) {
      cloudinary.uploader.destroy(
        article.image.split("/")[7].split(".")[0],
        function (error, result) {
          console.log(result, error);
        }
      );
    }
    res.redirect("/my-articles");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};
