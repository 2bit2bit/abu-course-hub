const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/is-auth");

const validateCreateArticle = require("../validators/create-article");
const validateEditArticle = require("../validators/edit-article");

const userController = require("../controllers/user");

router.get("/create-article", isAuth, userController.getCreateArticle);

router.post(
  "/create-article",
  isAuth,
  validateCreateArticle,
  userController.postCreateArticle
);

router.get("/my-articles", isAuth, userController.getMyArticles);

router.post(
  "/edit-article/:articleId/update_state",
  isAuth,
  userController.postUpdateState
);

router.get("/edit-article/:articleId", isAuth, userController.getEditArticle);
router.post(
  "/edit-article/:articleId",
  isAuth,
  validateEditArticle,
  userController.postEditArticle
);

router.post(
  "/delete-article/:articleId",
  isAuth,
  userController.postDeletetArticle
);

module.exports = router;
