const { default: mongoose } = require("mongoose");
const Article = require("../models/article");

exports.getIndex = (req, res, next) => {
  res.render("blog/index", {
    pageTitle: "Home",
    path: "/home"
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
  const title = req.query.title
  const regex = new RegExp(title, 'i') 

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
    const articles = await Article.find({state: "published", title: {$regex: regex}}).populate("author", "username");
    // .sort(sortQuery)
    // .skip(page)
    // .limit(per_page);

    // res.json(articles);

    res.render("blog/articles", {
      pageTitle: "Articles",
      path: "/articles",
      isLoggedIn: req.session.isLoggedIn,
      articles: articles,
      prevSearch: title
    });

  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};


exports.getArticle = async (req, res, next) => {
  const { articleId } = req.params;

  if (!mongoose.isValidObjectId(articleId)) {
    return res.status(404).render('404', {
      pageTitle: 'Page Not Found',
      path: '/404',
      isLoggedIn: req.session.isLoggedIn
    });
  }
  try {
    const article = await Article.findOne({
      _id: articleId,
      state: "published",
    }).populate("author", "username")

    if(!article) {
     return res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '/404',
        isLoggedIn: req.session.isLoggedIn
      });
    }

    article.read_count++;

    article.save();

    res.render("blog/article", {
      pageTitle: article.title,
      path: " ",
      isLoggedIn: req.session.isLoggedIn,
      article: article,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};