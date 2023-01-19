const Article = require("../models/article");

exports.getIndex = (req, res, next) => {
  res.render("blog/index", {
    pageTitle: "Home",
    path: "/home",
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.getArticles = async (req, res, next) => {
  // const { query } = req;
  // const {
  //   author,
  //   title,
  //   tags,

  //   order = "asc",
  //   order_by = "timestamp",

  //   page = 0,
  //   per_page = 20,
  // } = query;

  // const findQuery = { state: "published" };

  // if (author) {
  //   findQuery.author = author;
  // }

  // if (title) {
  //   findQuery.title = title;
  // }

  // if (tags) {
  //   findQuery.tags = {
  //     $in: tags.split(",").map((tag) => {
  //       return tag.trim();
  //     }),
  //   };
  // }

  // const sortQuery = {};

  // const sortAttributes = order_by.split(",").map((order) => {
  //   return order.trim();
  // });;

  // for (const attribute of sortAttributes) {
  //   if (order === "asc" && order_by) {
  //     sortQuery[attribute] = 1;
  //   }

  //   if (order === "desc" && order_by) {
  //     sortQuery[attribute] = -1;
  //   }
  // }

  try {
    const articles = await Article.find().populate("author", "username");
    // .sort(sortQuery)
    // .skip(page)
    // .limit(per_page);

    // res.json(articles);

    res.render("blog/articles", {
      pageTitle: "Articles",
      path: "/articles",
      isLoggedIn: req.session.isLoggedIn,
      articles: articles,
    });

  } catch (err) {
    res.status(500).json({ message: "an error occured" });
    console.log(err);
  }
};


exports.getArticle = async (req, res, next) => {
  const { articleId } = req.params;
  try {
    const article = await Article.findOne({
      _id: articleId,
      // state: "published",
    }).populate("author", "first_name last_name email");

    article.read_count++;

    article.save();

    // res.json(article);
    // console.log(article)

    res.render("blog/article", {
      pageTitle: article.title,
      path: " ",
      isLoggedIn: req.session.isLoggedIn,
      article: article,
    });
  } catch (err) {
    res.status(500).json({message: "an error occured"});
    console.log(err);
  }
};