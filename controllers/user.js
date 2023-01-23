const Article = require("../models/article");
const calcReadingTime = require("../utils/reading_time");

// const cloudinary = require('cloudinary').v2;

exports.getCreateArticle = (req, res, next) => {
  res.render("user/create-article", {
    pageTitle: "Create Article",
    path: "/create-article",
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postCreateArticle = async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const tags = req.body.tags.split(",").map((tag) => {
    return tag.trim();
  });
  
  const body = req.body.body;
  
  const publish = req.body.publish;
  const coverImage = req.body.coverImage
  const author = req.session.user;
  const reading_time = calcReadingTime.calcReadingTime(body);
  const article = new Article({
    title,
    description,
    author,
    reading_time,
    tags,
    body,
  });

  if (publish) {
    article.state = 'published'
  }

  try {
    await article.save();
    res.redirect('my-articles')
  } catch (err) {
    res.status(500).json({ message: "an error occured" });
    console.log(err);
  }
};

exports.getMyArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({
      author: req.session.user,
    });

    res.render("user/my-articles", {
      pageTitle: "My Articles",
      path: "/my-articles",
      isLoggedIn: req.session.isLoggedIn,
      articles: articles,
    });
  } catch (err) {
    res.status(500).json({ message: "an error occured" });
    console.log(err);
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
    });
  } catch (err) {
    res.status(500).json({ message: "an error occured" });
    console.log(err);
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
    res.status(500).json({ message: "an error occured" });
    console.log(err);
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
    res.redirect('/my-articles');
  } catch (err) {
    res.status(500).json({ message: "an error occured" });
    console.log(err);
  }
};


exports.postDeletetArticle =  async (req, res, next) => {
  const articleId = req.params.articleId;

  try {
    const response = await Article.deleteOne({
      _id: articleId,
      author: req.session.user,
    });
    res.redirect('/my-articles');
  } catch (err) {
    res.status(500).json({message: "an error occured"});
    console.log(err);
  }
};		 