const Article = require("../models/article");
const calcReadingTime = require("../utils/reading_time");

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
  const author = req.session.user;
  const reading_time = calcReadingTime.calcReadingTime(body);

//   if (await Article.findOne({ title })) {
//     res
//       .status(202)
//       .json({ message: "title already exist, try something different" });
//     return;
//   }

  const article = new Article({
    title,
    description,
    author,
    reading_time,
    tags,
    body,
  });

  try {
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: "an error occured" });
    console.log(err);
  }
};
